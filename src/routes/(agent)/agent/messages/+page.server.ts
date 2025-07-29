import { db } from "$lib/server/db";
import {
	conversation,
	conversationParticipant,
	listing,
	message,
	offer,
} from "$lib/server/db/schema";
import { messageSubscription } from "$lib/server/services/event";
import { Messaging } from "$lib/server/services/messaging";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends("message");
	if (!locals.user) {
		return redirect(302, "/");
	}

	const { userConversations, propertyDetails } = await Messaging.getConversations(locals.user.id);

	return {
		userConversations,
		propertyDetails,
		userId: locals.user.id,
	};
};

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		const formData = await request.formData();
		const res = z.object({ message: z.string().nonempty(), convId: z.number() }).safeParse({
			message: formData.get("message"),
			convId: Number(formData.get("convId")),
		});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		const conv = await db.transaction(async (db) => {
			const conv = await db.query.conversation.findFirst({
				where: eq(conversation.id, res.data.convId),
			});
			if (!conv) {
				return;
			}

			await db
				.insert(message)
				.values({ conversationId: conv.id, content: res.data.message, senderId: locals.user!.id });

			await db
				.update(conversationParticipant)
				.set({ lastReadAt: sql`now()` })
				.where(
					and(
						eq(conversationParticipant.conversationId, res.data.convId),
						eq(conversationParticipant.userId, locals.user!.id),
					),
				);

			return conv;
		});

		if (conv) {
			messageSubscription?.emitEvent(String(conv.id));
		}
	},
	updateReadTime: async ({ locals, request }) => {
		const formData = await request.formData();
		const res = z
			.object({ convId: z.number() })
			.safeParse({ convId: Number(formData.get("convId")) });

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		await db
			.update(conversationParticipant)
			.set({ lastReadAt: sql`now()` })
			.where(
				and(
					eq(conversationParticipant.conversationId, res.data.convId),
					eq(conversationParticipant.userId, locals.user!.id),
				),
			);
	},
	approveListing: async ({ locals, request }) => {
		const formData = await request.formData();
		const res = z
			.object({ listingId: z.number() })
			.safeParse({ listingId: Number(formData.get("listingId")) });

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		// Verify the agent owns this listing
		const listingRecord = await db.query.listing.findFirst({
			where: and(eq(listing.id, res.data.listingId), eq(listing.agentId, locals.user!.id)),
		});

		if (!listingRecord) {
			return fail(403, { err: "unauthorized" });
		}

		// Update listing status from 'submitted' to 'up'
		await db
			.update(listing)
			.set({
				status: "up",
				dateModified: sql`now()`,
			})
			.where(eq(listing.id, res.data.listingId));
	},
	markOfferSold: async ({ locals, request }) => {
		const formData = await request.formData();
		const res = z
			.object({
				offerId: z.number(),
				listingId: z.number(),
			})
			.safeParse({
				offerId: Number(formData.get("offerId")),
				listingId: Number(formData.get("listingId")),
			});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		// Verify the agent owns the listing for this offer
		const listingRecord = await db.query.listing.findFirst({
			where: and(eq(listing.id, res.data.listingId), eq(listing.agentId, locals.user!.id)),
		});

		if (!listingRecord) {
			return fail(403, { err: "unauthorized" });
		}

		await db.transaction(async (db) => {
			// Mark the offer as completed
			await db.update(offer).set({ status: "completed" }).where(eq(offer.id, res.data.offerId));

			// Mark the listing as sold
			await db
				.update(listing)
				.set({
					status: "sold",
					dateModified: sql`now()`,
				})
				.where(eq(listing.id, res.data.listingId));
		});
	},
};

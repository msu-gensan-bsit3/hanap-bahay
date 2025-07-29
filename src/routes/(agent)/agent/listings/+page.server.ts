import { db } from "$lib/server/db";
import { conversation, conversationParticipant, listing, seller } from "$lib/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, eq, exists } from "drizzle-orm";
import z from "zod";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	const { listings } = await parent();

	// Get seller information for each listing through property ownership
	const listingsWithSellers = await Promise.all(
		listings.map(async (listing) => {
			const property = listing.property;
			const sellerData = await db.query.seller.findFirst({
				where: eq(seller.id, property.sellerId),
				with: { user: true },
			});
			return {
				...listing,
				seller: sellerData,
			};
		}),
	);

	return {
		listings: listingsWithSellers,
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		if (!locals.user) {
			return redirect(302, "/login");
		}

		const formData = await request.formData();
		const res = z
			.object({
				listingId: z.number(),
				status: z.enum(["up", "pending", "sold", "under-review", "submitted"]),
			})
			.safeParse({
				listingId: Number(formData.get("listingId")),
				status: formData.get("status"),
			});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		// Verify the agent owns this listing
		const curListing = await db.query.listing.findFirst({
			where: and(eq(listing.id, res.data.listingId), eq(listing.agentId, locals.user.id)),
		});
		if (!curListing) {
			return fail(400, { err: "listing not found or access denied" });
		}

		// Update listing status
		await db
			.update(listing)
			.set({
				status: res.data.status,
				dateModified: new Date(),
			})
			.where(eq(listing.id, res.data.listingId));

		return { success: true };
	},

	sendMessage: async ({ request, locals }) => {
		if (!locals.user) {
			return redirect(302, "/login");
		}

		const formData = await request.formData();
		const res = z.object({ sellerId: z.number(), listingId: z.number() }).safeParse({
			sellerId: Number(formData.get("sellerId")),
			listingId: Number(formData.get("listingId")),
		});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		if (!locals.user) {
			return error(500, { message: "this shouldn't happen" });
		}

		const sellerId = res.data.sellerId;
		const listingId = res.data.listingId;

		// Verify the seller exists
		const curSeller = await db.query.seller.findFirst({
			where: eq(seller.id, sellerId),
			with: { user: true },
		});
		if (!curSeller) {
			return fail(400, { err: "seller id not found" });
		}

		// Verify the agent owns this listing
		const curListing = await db.query.listing.findFirst({
			where: and(eq(listing.id, listingId), eq(listing.agentId, locals.user.id)),
		});
		if (!curListing) {
			return fail(400, { err: "listing not found or access denied" });
		}

		const subquery = db
			.select({ conversationId: conversation.id })
			.from(conversationParticipant)
			.where(eq(conversationParticipant.userId, locals.user.id))
			.innerJoin(conversation, eq(conversation.id, conversationParticipant.conversationId))
			.as("subquery");

		let [queryResult] = await db
			.select({ conversation })
			.from(conversationParticipant)
			.where(
				and(
					exists(
						db
							.select()
							.from(subquery)
							.where(eq(conversationParticipant.conversationId, subquery.conversationId)),
					),
					eq(conversationParticipant.userId, locals.user.id),
				),
			)
			.innerJoin(conversation, eq(conversation.id, conversationParticipant.conversationId));

		if (queryResult) {
			return redirect(302, `/agent/messages?convId=${queryResult.conversation.id}`);
		}
	},
};

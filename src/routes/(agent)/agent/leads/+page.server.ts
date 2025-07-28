import { db } from "$lib/server/db";
import {
	buyer,
	conversation,
	conversationParticipant,
	listing,
	offer,
	offerQuery,
} from "$lib/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, eq, exists, inArray } from "drizzle-orm";
import z from "zod";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
	const { listings } = await parent();

	const offers = await db.query.offer.findMany({
		where: inArray(
			offer.listingId,
			listings.map((v) => v.id),
		),
		...offerQuery,
	});

	return {
		leads: offers,
	};
};

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		if (!locals.user) {
			return redirect(302, "/login");
		}

		const formData = await request.formData();
		const res = z.object({ buyerId: z.number(), listingId: z.number() }).safeParse({
			buyerId: Number(formData.get("buyerId")),
			listingId: Number(formData.get("listingId")),
		});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		if (!locals.user) {
			return error(500, { message: "this shouldn't happen" });
		}

		const buyerId = res.data.buyerId;
		const listingId = res.data.listingId;

		// Verify the buyer exists
		const curBuyer = await db.query.buyer.findFirst({ where: eq(buyer.id, buyerId) });
		if (!curBuyer) {
			return fail(400, { err: "buyer id not found" });
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

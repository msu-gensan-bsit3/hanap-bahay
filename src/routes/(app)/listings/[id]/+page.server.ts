import { db } from "$lib/server/db";
import {
	agent,
	buyer,
	conversation,
	conversationParticipant,
	listing,
	listingQuery,
	offer,
	offerConversation,
	user,
} from "$lib/server/db/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, eq, exists } from "drizzle-orm";
import z from "zod";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.id);
	if (!id) {
		return error(400, "Invalid listing id");
	}

	const curListing = await db.query.listing.findFirst({
		...listingQuery,
		where: eq(listing.id, id),
	});

	if (!curListing) {
		return error(404, "Listing id not found");
	}

	let role: "anon" | "buyer" | "seller" | "agent" = "anon";

	if (locals.user) {
		const userData = await db.query.user.findFirst({
			columns: {},
			with: { agent: true, buyer: true, seller: true },
			where: eq(user.id, locals.user.id),
		});

		if (userData?.agent) {
			role = "agent";
		} else if (userData?.seller && curListing.property.sellerId === userData.seller.id) {
			role = "seller";
		} else {
			role = "buyer";
		}
	}

	if (!["up", "sold", "pending"].includes(curListing.status)) {
		return error(400, "Listing not available.");
	}

	return {
		listing: curListing,
		user: locals.user,
		role,
	};
};

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		if (!locals.user) {
			return redirect(302, "/login");
		}

		const formData = await request.formData();
		const res = z.object({ agentId: z.number(), listingId: z.number() }).safeParse({
			agentId: Number(formData.get("agentId")),
			listingId: Number(formData.get("listingId")),
		});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		if (!locals.user) {
			return error(500, { message: "this shouldn't happen" });
		}

		const agentId = res.data.agentId;
		const listingId = res.data.listingId;

		const curAgent = await db.query.agent.findFirst({ where: eq(agent.id, agentId) });
		if (!curAgent) {
			return fail(400, { err: "agent id not found" });
		}

		if (await db.query.agent.findFirst({ where: eq(agent.id, locals.user.id) })) {
			return fail(400, { err: "agent can't make an offer" });
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
					eq(conversationParticipant.userId, agentId),
				),
			)
			.innerJoin(conversation, eq(conversation.id, conversationParticipant.conversationId));

		if (!queryResult) {
			await db.transaction(async (db) => {
				const createdConversation = (await db.insert(conversation).values({}).returning())[0];

				await db
					.insert(conversationParticipant)
					.values({ conversationId: createdConversation.id, userId: locals.user!.id });

				await db
					.insert(conversationParticipant)
					.values({ conversationId: createdConversation.id, userId: agentId });

				queryResult = {
					conversation: createdConversation,
				};
			});
		}

		await db.transaction(async (db) => {
			let b = await db.query.buyer.findFirst({ where: eq(buyer.id, locals.user!.id) });
			if (!b) {
				const [res] = await db.insert(buyer).values({ id: locals.user!.id }).returning();
				b = res;
			}

			let o = await db.query.offer.findFirst({
				where: and(eq(offer.listingId, listingId), eq(offer.buyerId, b.id)),
			});
			if (!o) {
				const [res] = await db.insert(offer).values({ buyerId: b.id, listingId }).returning();
				o = res;
			}
			let res = await db.query.offerConversation.findFirst({
				where: and(
					eq(offerConversation.offerId, o.id),
					eq(offerConversation.conversationId, queryResult.conversation.id),
				),
			});

			if (!res) {
				await db
					.insert(offerConversation)
					.values({ offerId: o.id, conversationId: queryResult.conversation.id });
			}
		});

		return redirect(302, "/messages?convId=" + queryResult.conversation.id);
	},
};

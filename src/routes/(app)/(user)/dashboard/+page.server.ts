import { db } from "$lib/server/db";
import {
	agent,
	agentQuery,
	buyer,
	conversation,
	conversationParticipant,
	offer,
	offerConversation,
	property,
	seller,
} from "$lib/server/db/schema";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq, exists } from "drizzle-orm";
import z from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			userListings: [],
			userOffers: [],
			userType: null,
		};
	}

	// Check if user is a seller
	const sellerData = await db.query.seller.findFirst({
		where: eq(seller.id, locals.user.id),
	});

	// Check if user is a buyer
	const buyerData = await db.query.buyer.findFirst({
		where: eq(buyer.id, locals.user.id),
	});

	let userOffers;
	let userListings;

	// If user is a seller, fetch their property listings
	if (sellerData) {
		userListings = await db.query.property.findMany({
			where: eq(property.sellerId, locals.user.id),
			with: {
				photosUrl: {
					columns: { url: true },
				},
				address: true,
				listing: {
					with: {
						agent: agentQuery,
					},
				},
			},
		});
	}

	// If user is a buyer, fetch their offers
	if (buyerData) {
		userOffers = await db.query.offer.findMany({
			where: eq(offer.buyerId, locals.user.id),
			with: {
				listing: {
					with: {
						property: {
							with: {
								photosUrl: {
									columns: { url: true },
								},
								address: true,
							},
						},
						agent: agentQuery,
					},
				},
			},
		});
	}

	return {
		userListings,
		userOffers,
		userType: {
			isSeller: !!sellerData,
			isBuyer: !!buyerData,
		},
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

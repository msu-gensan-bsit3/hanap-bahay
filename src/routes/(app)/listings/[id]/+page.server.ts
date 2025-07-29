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
import { sendNewOfferNotification } from "$lib/server/services/mail";
import { error, fail, redirect } from "@sveltejs/kit";
import { and, eq, exists } from "drizzle-orm";
import z from "zod";
import type { Actions, PageServerLoad } from "./$types";

// Async function to send offer notification email
async function sendOfferNotificationEmail(offerId: number, listingId: number, buyerId: number) {
	try {
		// Get the offer, listing, agent, and buyer details
		const offerData = await db.query.offer.findFirst({
			where: eq(offer.id, offerId),
			with: {
				listing: {
					with: {
						property: true,
						agent: {
							with: {
								user: {
									with: {
										address: true,
									},
								},
							},
						},
					},
				},
				buyer: {
					with: {
						user: {
							with: {
								address: true,
							},
						},
					},
				},
			},
		});

		if (offerData && offerData.listing && offerData.listing.agent && offerData.buyer) {
			const agent = offerData.listing.agent;
			const buyer = offerData.buyer;
			const property = offerData.listing.property;

			await sendNewOfferNotification(
				agent.user.email,
				`${agent.user.firstName} ${agent.user.lastName}`,
				property.name,
				`${buyer.user.firstName} ${buyer.user.lastName}`,
				offerId,
				listingId,
			);
		}
	} catch (error) {
		console.error("Failed to send offer notification email:", error);
		// Don't throw error to avoid affecting the main flow
	}
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.id);
	if (!id) {
		return error(400, "Invalid listing id");
	}

	const curListing = await db.query.listing.findFirst({
		...listingQuery,
		where: eq(listing.propertyId, id),
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

	if (
		!["up", "sold", "pending"].includes(curListing.status) &&
		curListing.agent.user.id !== locals.user?.id &&
		curListing.property.sellerId !== locals.user?.id
	) {
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

		let isNewOffer = false;
		let createdOfferId: number | null = null;

		await db.transaction(async (db) => {
			const curListing = await db.query.listing.findFirst({
				where: eq(listing.id, listingId),
				with: {
					property: true,
				},
			});

			if (locals.user?.id === curListing?.property.sellerId) {
				return;
			}

			let b = await db.query.buyer.findFirst({ where: eq(buyer.id, locals.user!.id) });
			if (!b) {
				const [res] = await db.insert(buyer).values({ id: locals.user!.id }).returning();
				b = res;
			}
			let o = await db.query.offer.findFirst({
				where: and(eq(offer.listingId, listingId), eq(offer.buyerId, b.id)),
			});
			if (!o) {
				const [res] = await db.insert(offer).values({ buyerId: b!.id, listingId }).returning();
				o = res;
				isNewOffer = true;
				createdOfferId = o.id;
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

		// Send email notification asynchronously for new offers
		if (isNewOffer && createdOfferId) {
			// Don't await this - let it run in the background
			sendOfferNotificationEmail(createdOfferId, listingId, locals.user.id);
		}

		return redirect(302, "/messages?convId=" + queryResult.conversation.id);
	},
};

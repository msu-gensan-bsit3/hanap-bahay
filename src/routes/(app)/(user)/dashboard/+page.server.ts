import { db } from "$lib/server/db";
import {
	agent,
	agentQuery,
	buyer,
	conversation,
	conversationParticipant,
	listing,
	offer,
	offerConversation,
	photosUrl,
	property,
	propertyFeature,
	propertyTag,
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

	deleteListing: async ({ request, locals }) => {
		if (!locals.user) {
			return redirect(302, "/login");
		}

		const formData = await request.formData();
		const propertyId = Number(formData.get("propertyId"));

		if (!propertyId || isNaN(propertyId)) {
			return fail(400, { error: "Invalid property ID" });
		}

		try {
			// First, verify that the property belongs to the current user (seller)
			const propertyData = await db.query.property.findFirst({
				where: eq(property.id, propertyId),
				with: {
					listing: true,
				},
			});

			if (!propertyData) {
				return fail(404, { error: "Property not found" });
			}

			if (propertyData.sellerId !== locals.user.id) {
				return fail(403, { error: "You can only delete your own properties" });
			}

			// Delete in transaction to ensure data consistency
			await db.transaction(async (tx) => {
				// If listing exists, delete related offers and conversations first
				if (propertyData.listing) {
					// Find all offers for this listing
					const listingOffers = await tx.query.offer.findMany({
						where: eq(offer.listingId, propertyData.listing.id),
					});

					// Delete offer conversations for each offer
					for (const offerItem of listingOffers) {
						await tx.delete(offerConversation).where(eq(offerConversation.offerId, offerItem.id));
					}

					// Delete all offers for this listing
					await tx.delete(offer).where(eq(offer.listingId, propertyData.listing.id));

					// Delete the listing
					await tx.delete(listing).where(eq(listing.propertyId, propertyId));
				}

				// Delete related property data
				await tx.delete(propertyFeature).where(eq(propertyFeature.propertyId, propertyId));
				await tx.delete(propertyTag).where(eq(propertyTag.propertyId, propertyId));
				await tx.delete(photosUrl).where(eq(photosUrl.propertyId, propertyId));

				// Finally delete the property
				await tx.delete(property).where(eq(property.id, propertyId));
			});

			return { success: true, message: "Property deleted successfully" };
		} catch (error) {
			console.error("Error deleting property:", error);
			return fail(500, { error: "Failed to delete property" });
		}
	},
};

import { db } from "$lib/server/db";
import {
	conversation,
	conversationParticipant,
	conversationQuery,
	listing,
	propertyQuery,
} from "$lib/server/db/schema";
import { eq, exists, inArray } from "drizzle-orm";

export class Messaging {
	constructor(
		private userId: number,
		private role: "buyer" | "seller",
	) {}

	static async getConversations(userId: number) {
		const subquery = db
			.select({ conversationId: conversation.id })
			.from(conversationParticipant)
			.where(eq(conversationParticipant.userId, userId))
			.innerJoin(conversation, eq(conversation.id, conversationParticipant.conversationId))
			.as("subquery");

		const userConversations = await db.query.conversation.findMany({
			where: exists(db.select().from(subquery).where(eq(conversation.id, subquery.conversationId))),
			with: {
				...conversationQuery.with,
				offerConversations: {
					columns: {},
					with: {
						offer: {
							columns: {},
							with: {
								listing: {
									columns: { id: true, agentId: true },
									with: {
										property: true,
									},
								},
							},
						},
					},
				},
			},
		});

		const listingsRecord: Record<string, {}> = {};
		userConversations.forEach((v) => {
			v.offerConversations.forEach((y) => {
				listingsRecord[y.offer.listing.id] = {};
			});
		});
		const listings = Object.keys(listingsRecord).map(Number);

		const propertyDetails = await db.query.listing.findMany({
			where: inArray(listing.id, listings),
			columns: {},
			with: { property: propertyQuery },
		});

		return { userConversations, propertyDetails };
	}

	static async getPropertyDetails(offerId: number) {
		// await db.query.property.findFirst({where: })
	}
}

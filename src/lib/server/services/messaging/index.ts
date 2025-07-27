import { db } from "$lib/server/db";
import {
	buyer,
	conversation,
	conversationParticipant,
	conversationQuery,
} from "$lib/server/db/schema";
import { eq, exists } from "drizzle-orm";

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
									columns: {},
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
		return userConversations;
	}
}

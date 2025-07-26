import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { conversation, conversationParticipant, conversationQuery } from "$lib/server/db/schema";
import { eq, exists } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, "/");
	}

	const subquery = db
		.select({ conversationId: conversation.id })
		.from(conversationParticipant)
		.where(eq(conversationParticipant.userId, locals.user.id))
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

	return {
		userConversations,
		userId: locals.user.id,
	};
};

export const actions: Actions = {};

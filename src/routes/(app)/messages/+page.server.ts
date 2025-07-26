import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { conversationParticipant, conversationQuery } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, "/");
	}

	const userConversation = await db.query.conversationParticipant.findMany({
		columns: { conversationId: false, userId: false },
		with: {
			conversation: {
				columns: { offerId: false },
				with: {
					...conversationQuery.with,
					offer: {
						columns: {},
						with: {
							listing: {
								columns: {},
								with: {
									property: {
										columns: {
											name: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
		where: eq(conversationParticipant.userId, locals.user.id),
	});

	return {
		userConversation,
		userId: locals.user.id
	};
};

export const actions: Actions = {};

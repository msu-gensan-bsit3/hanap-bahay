import { Messaging } from "$lib/server/services/messaging";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { userConversations } = await Messaging.getConversations(locals.user.id);

		let totalUnread = 0;

		userConversations.forEach((conversation) => {
			const userParticipant = conversation.participants.find((p) => p.user.id === locals.user!.id);

			if (userParticipant) {
				const unreadCount = conversation.messages.filter(
					(msg) =>
						userParticipant.lastReadAt &&
						msg.updatedAt &&
						new Date(msg.updatedAt) > new Date(userParticipant.lastReadAt),
				).length;

				totalUnread += unreadCount;
			}
		});

		return json({ count: totalUnread });
	} catch (error) {
		console.error("Error fetching unread message count:", error);
		return json({ error: "Internal server error" }, { status: 500 });
	}
};

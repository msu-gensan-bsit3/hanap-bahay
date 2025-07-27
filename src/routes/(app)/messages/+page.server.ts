import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { Messaging } from "$lib/server/services/messaging";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { agent, conversation, message } from "$lib/server/db/schema";
import z from "zod";
import { messageSubscription } from "$lib/server/services/event";

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends("message");
	if (!locals.user) {
		return redirect(302, "/");
	}

	const isAgent = await db.query.agent.findFirst({ where: eq(agent.id, locals.user.id) });
	if (isAgent) {
		return redirect(302, "/agent/messages");
	}

	const userConversations = await Messaging.getConversations(locals.user.id);

	return {
		userConversations,
		userId: locals.user.id,
	};
};

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		const formData = await request.formData();
		const res = z.object({ message: z.string().nonempty(), convId: z.number() }).safeParse({
			message: formData.get("message"),
			convId: Number(formData.get("convId")),
		});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		const conv = await db.transaction(async (db) => {
			const conv = await db.query.conversation.findFirst({
				where: eq(conversation.id, res.data.convId),
			});
			if (!conv) {
				return;
			}

			await db
				.insert(message)
				.values({ conversationId: conv.id, content: res.data.message, senderId: locals.user!.id });

			return conv;
		});

		if (conv) {
			messageSubscription.emitEvent(String(conv.id));
		}
	},
};

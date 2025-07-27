import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Messaging } from "$lib/server/services/messaging";
import { db } from "$lib/server/db";
import { conversation, conversationParticipant, message } from "$lib/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";
import { messageSubscription } from "$lib/server/services/event";

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends("message");
	if (!locals.user) {
		return redirect(302, "/");
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

			await db
				.update(conversationParticipant)
				.set({ lastReadAt: sql`now()` })
				.where(
					and(
						eq(conversationParticipant.conversationId, res.data.convId),
						eq(conversationParticipant.userId, locals.user!.id),
					),
				);

			return conv;
		});

		if (conv) {
			messageSubscription.emitEvent(String(conv.id));
		}
	},
	updateReadTime: async ({ locals, request }) => {
		const formData = await request.formData();
		const res = z
			.object({ convId: z.number() })
			.safeParse({ convId: Number(formData.get("convId")) });

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		await db
			.update(conversationParticipant)
			.set({ lastReadAt: sql`now()` })
			.where(
				and(
					eq(conversationParticipant.conversationId, res.data.convId),
					eq(conversationParticipant.userId, locals.user!.id),
				),
			);
	},
};

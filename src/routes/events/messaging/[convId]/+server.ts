import { db } from "$lib/server/db";
import { generateSessionToken } from "$lib/server/services/auth";
import { messageSubscription } from "$lib/server/services/event";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { produce } from "sveltekit-sse";
import { conversation } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals, params }) => {
	const res = await db.query.conversation.findFirst({
		where: eq(conversation.id, Number(params.convId)),
		with: {
			participants: true,
		},
	});
	if (!locals.user) {
		return error(400, "invalid user");
	}
	if (!res) {
		return error(400, "no conversation found");
	}

	if (!res.participants.find((u) => u.userId === locals.user!.id)) {
		return error(400, "user not in conversation");
	}

	return produce(async ({ emit }) => {
		const sessionId = generateSessionToken();
		messageSubscription.subscribe(params.convId, sessionId, emit);

		return () => {
			messageSubscription.unsubscribe(params.convId, sessionId);
		};
	});
};

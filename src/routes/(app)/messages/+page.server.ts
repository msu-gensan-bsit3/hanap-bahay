import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { Messaging } from "$lib/server/services/messaging";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { agent } from "$lib/server/db/schema";

export const load: PageServerLoad = async ({ locals }) => {
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

export const actions: Actions = {};

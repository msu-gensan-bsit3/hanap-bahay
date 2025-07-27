import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Messaging } from "$lib/server/services/messaging";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, "/");
	}

	const userConversations = await Messaging.getConversations(locals.user.id);

	return {
		userConversations,
		userId: locals.user.id,
	};
};

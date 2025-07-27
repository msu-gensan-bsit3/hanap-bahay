import { db } from "$lib/server/db";
import { agentQuery, listingQuery, propertyQuery, userQuery } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";
import { askAiSchema } from "$lib/schema";
import { fail } from "@sveltejs/kit";
import { chatbotSendMessage } from "$lib/server/services/chatbot";

export const load: PageServerLoad = async () => {
	const listings = await db.query.listing.findMany({
		...listingQuery,
		with: {
			agent: agentQuery,
			property: { ...propertyQuery, columns: { ...propertyQuery.columns, sellerId: false } },
		},
		limit: 20,
	});

	return {
		listings,
	};
};

export const actions: Actions = {
	askAi: async ({ request }) => {
		const formData = await request.formData();

		const res = askAiSchema.safeParse(Object.fromEntries(formData));
		if (!res.success) {
			return fail(400, { type: "askAi", msg: "invalid data" });
		}

		const aiMessage = await chatbotSendMessage(res.data.chatInput, res.data.sessionId);
		if (aiMessage.err) {
			return fail(400, { type: "askAi", msg: aiMessage.err });
		}

		return { type: "askAi", msg: aiMessage.msg! };
	},
};

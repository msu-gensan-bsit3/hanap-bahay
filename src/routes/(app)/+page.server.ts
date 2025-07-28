import { askAiSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import { agentQuery, listingQuery, propertyQuery } from "$lib/server/db/schema";
import { chatbotSendMessage } from "$lib/server/services/ai/chatbot";
import { searchWithAi } from "$lib/server/services/ai/search";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const listingsPromise = db.query.listing.findMany({
		...listingQuery,
		with: {
			agent: agentQuery,
			property: { ...propertyQuery, columns: { ...propertyQuery.columns, sellerId: false } },
		},
		limit: 8,
	});

	const agentsPromise = db.query.agent.findMany({
		...agentQuery,
		limit: 8,
	});

	return {
		listings: listingsPromise,
		agents: agentsPromise,
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

	searchWithAi: async ({ request }) => {
		const formData = await request.formData();

		const res = askAiSchema.safeParse(Object.fromEntries(formData));
		if (!res.success) {
			return fail(400, { type: "searchWithAi", msg: "invalid data" });
		}

		const aiMessage = await searchWithAi(res.data.chatInput, res.data.sessionId);
		if (aiMessage.err) {
			return fail(400, { type: "searchWithAi", msg: aiMessage.err });
		}

		return { type: "searchWithAi", msg: aiMessage.msg! };
	},
};

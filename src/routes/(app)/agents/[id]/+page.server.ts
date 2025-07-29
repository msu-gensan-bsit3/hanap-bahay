import { db } from "$lib/server/db";
import {
	agent,
	agentQuery,
	conversation,
	conversationParticipant,
	listingQuery,
} from "$lib/server/db/schema";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq, exists } from "drizzle-orm";
import z from "zod";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	const agentId = parseInt(params.id);

	if (isNaN(agentId)) {
		return error(404, "Agent not found");
	}

	// Fetch agent data
	const agent = await db.query.agent.findFirst({
		...agentQuery,
		where: (agents, { eq }) => eq(agents.id, agentId),
	});

	if (!agent) {
		return error(404, "Agent not found");
	}

	// Fetch agent's active listings
	const listings = await db.query.listing.findMany({
		...listingQuery,
		with: {
			property: {
				...listingQuery.with.property,
				columns: {
					...listingQuery.with.property.columns,
					sellerId: false,
				},
			},
			agent: listingQuery.with.agent,
		},
		where: (listings, { eq, and }) => and(eq(listings.agentId, agentId)),
		orderBy: (listings, { desc }) => [desc(listings.dateCreated)],
	});

	return {
		agent,
		listings,
		user: locals.user,
	};
};

export const actions: Actions = {
	sendMessage: async ({ request, locals }) => {
		if (!locals.user) {
			return redirect(302, "/login");
		}

		const formData = await request.formData();
		const res = z.object({ agentId: z.number() }).safeParse({
			agentId: Number(formData.get("agentId")),
		});

		if (res.error) {
			return fail(400, { err: "invalid input" });
		}

		if (!locals.user) {
			return error(500, { message: "this shouldn't happen" });
		}

		const agentId = res.data.agentId;

		const curAgent = await db.query.agent.findFirst({ where: eq(agent.id, agentId) });
		if (!curAgent) {
			return fail(400, { err: "agent id not found" });
		}

		const subquery = db
			.select({ conversationId: conversation.id })
			.from(conversationParticipant)
			.where(eq(conversationParticipant.userId, locals.user.id))
			.innerJoin(conversation, eq(conversation.id, conversationParticipant.conversationId))
			.as("subquery");

		let [queryResult] = await db
			.select({ conversation })
			.from(conversationParticipant)
			.where(
				and(
					exists(
						db
							.select()
							.from(subquery)
							.where(eq(conversationParticipant.conversationId, subquery.conversationId)),
					),
					eq(conversationParticipant.userId, agentId),
				),
			)
			.innerJoin(conversation, eq(conversation.id, conversationParticipant.conversationId));

		if (!queryResult) {
			await db.transaction(async (db) => {
				const createdConversation = (await db.insert(conversation).values({}).returning())[0];

				await db
					.insert(conversationParticipant)
					.values({ conversationId: createdConversation.id, userId: locals.user!.id });

				await db
					.insert(conversationParticipant)
					.values({ conversationId: createdConversation.id, userId: agentId });

				queryResult = {
					conversation: createdConversation,
				};
			});
		}

		return redirect(302, "/messages?convId=" + queryResult.conversation.id);
	},
};

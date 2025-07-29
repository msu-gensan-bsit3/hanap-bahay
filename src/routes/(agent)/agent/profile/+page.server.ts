import { db } from "$lib/server/db";
import { agent, agentQuery } from "$lib/server/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	// Get the complete agent data with user information
	const agentData = await db.query.agent.findFirst({
		...agentQuery,
		where: eq(agent.id, locals.user.id),
	});

	if (!agentData) {
		throw error(404, "Agent not found");
	}

	return {
		agent: agentData,
	};
};

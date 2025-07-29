import { db } from "$lib/server/db";
import { agentQuery } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const agentsPromise = db.query.agent.findMany(agentQuery);

	// Add sample data if no agents exist

	return {
		agents: agentsPromise,
	};
};

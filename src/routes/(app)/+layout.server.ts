import { db } from "$lib/server/db";
import { agent } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	let curAgent;
	if (locals.user) {
		curAgent = await db.query.agent.findFirst({ where: eq(agent.id, locals.user?.id) });
	}

	return {
		user: locals.user,
		curAgent,
	};
};

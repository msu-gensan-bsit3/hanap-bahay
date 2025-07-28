import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { user, userQuery } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	// Get the complete user data with address
	const userData = await db.query.user.findFirst({
		...userQuery,
		where: eq(user.id, locals.user.id)
	});

	if (!userData) {
		throw error(404, "User not found");
	}

	return {
		user: userData,
	};
};

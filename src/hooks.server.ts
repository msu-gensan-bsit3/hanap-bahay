import { error, redirect, type Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/services/auth";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { agent, user } from "$lib/server/db/schema";

const protectedRoutes = ["admin", "(agent)"];

function validateRoute(currentRoute: string) {
	for (const route of protectedRoutes) {
		if (currentRoute.includes(route)) {
			return true;
		}
	}
	return false;
}

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	const route = event.route.id;
	if (!route) {
		return error(404);
	}

	if (sessionToken) {
		const res = await auth.validateSessionToken(sessionToken);

		event.locals.user = res.user;
		event.locals.session = res.session;

		if (!res.user) {
			auth.deleteSessionTokenCookie(event);
		}
	}

	if (validateRoute(route)) {
		if (!event.locals.user) {
			event.locals.user = null;
			event.locals.session = null;

			return redirect(302, "/login");
		}

		if (route.includes("(agent)")) {
			const isAgent = await db.query.agent.findFirst({ where: eq(agent.id, user.id) });

			if (!isAgent) {
				return redirect(302, "/");
			}
		}
	}

	return resolve(event);
};

export const handle: Handle = handleAuth;

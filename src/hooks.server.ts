import { error, redirect, type Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/services/auth";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { agent } from "$lib/server/db/schema";

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

	if (validateRoute(route)) {
		if (!sessionToken) {
			event.locals.user = null;
			event.locals.session = null;
			return redirect(302, "/signin");
		}

		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (!session) {
			auth.deleteSessionTokenCookie(event);
			return redirect(302, "/signin");
		}

		if (route.includes("(agent)")) {
			const isAgent = await db.query.agent.findFirst({ where: eq(agent.id, user.id) });

			if (!isAgent) {
				return redirect(302, "/");
			}
		}

		event.locals.user = user;
		event.locals.session = session;
	}

	return resolve(event);
};

export const handle: Handle = handleAuth;

import { error, redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

const protectedRoutes = [''];

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
			return redirect(302, '/signin');
		}

		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (session) {
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			auth.deleteSessionTokenCookie(event);
		}

		event.locals.user = user;
		event.locals.session = session;
	}

	return resolve(event);
};

export const handle: Handle = handleAuth;

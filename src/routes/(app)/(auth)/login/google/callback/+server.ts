import { db } from "$lib/server/db";
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from "$lib/server/services/auth";
// import { addUser } from "$lib/server/db/queries";
import { user } from "$lib/server/db/schema";
import { google } from "$lib/server/services/auth/google";
import { redirect, type RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import { decodeIdToken } from "arctic";
import { eq, sql } from "drizzle-orm";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400,
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400,
		});
	}
	const claims = decodeIdToken(tokens.idToken()) as {
		sub: string;
		email: string;
		given_name: string;
		family_name: string | undefined;
		picture: string;
	};

	const email = claims.email;

	const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });

	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		await db
			.update(user)
			.set({ profilePicture: claims.picture })
			.where(eq(user.id, existingUser.id));

		event.cookies.delete("google_code_verifier", { path: "/" });
		event.cookies.delete("google_oauth_state", { path: "/" });

		return redirect(302, "/");
	}

	// return error(400, "cant signup with google");

	const [newUser] = await db
		.insert(user)
		.values({
			email: claims.email,
			firstName: claims.given_name,
			lastName: claims.family_name ?? "",
			profilePicture: claims.picture,
			addressId: 1,
			birthDate: sql`now()`,
			mobileNumber: "+639123456789",
			passwordHash: "random",
			username: crypto.randomUUID(),
		})
		.returning({ id: user.id });

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, newUser.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	event.cookies.delete("google_code_verifier", { path: "/" });
	event.cookies.delete("google_oauth_state", { path: "/" });

	return redirect(302, "/");
}

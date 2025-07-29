import { fail, redirect, type Actions } from "@sveltejs/kit";
import { loginSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import {
	generateSessionToken,
	createSession,
	setSessionTokenCookie,
} from "$lib/server/services/auth";
import { eq, or } from "drizzle-orm";
import { verify } from "@node-rs/argon2";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(302, "/");
	}

	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const result = loginSchema.safeParse(Object.fromEntries(formData));

		if (!result.success) {
			return fail(400, {
				type: "login",
				errors: result.error.flatten().fieldErrors,
				data: {
					identifier: formData.get("identifier")?.toString() ?? "",
				},
			});
		}

		const { identifier, password } = result.data;

		try {
			// Find user by email or username
			const [existingUser] = await db
				.select()
				.from(user)
				.where(or(eq(user.email, identifier), eq(user.username, identifier)))
				.limit(1);

			if (!existingUser) {
				return fail(400, {
					type: "login",
					message: "Invalid email/username or password",
					data: { identifier },
				});
			}

			// Check if account is active
			if (existingUser.status !== "ACTIVE") {
				return fail(400, {
					type: "login",
					message: "Account is not active. Please contact support.",
					data: { identifier },
				});
			}

			// Verify password
			const isValidPassword = await verify(existingUser.passwordHash, password);
			if (!isValidPassword) {
				return fail(400, {
					type: "login",
					message: "Invalid email/username or password",
					data: { identifier },
				});
			}

			// Create session
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, existingUser.id);

			setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error("Login error:", error);

			if (error instanceof Response) {
				throw error;
			}

			return fail(500, {
				type: "login",
				message: "An unexpected error occurred. Please try again.",
				data: { identifier },
			});
		}
		return redirect(302, "/");
	},
};

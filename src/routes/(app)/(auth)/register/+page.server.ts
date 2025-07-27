import { fail, redirect, type Actions } from "@sveltejs/kit";
import { registerSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import { user, address, agent, buyer, seller } from "$lib/server/db/schema";
import {
	generateSessionToken,
	createSession,
	setSessionTokenCookie,
} from "$lib/server/services/auth";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		return redirect(302, "/");
	}

	return {};
};

export const actions: Actions = {
	register: async (event) => {
		const { request } = event;
		const formData = await request.formData();
		const result = registerSchema.safeParse(Object.fromEntries(formData));

		if (!result.success) {
			return fail(400, {
				type: "register",
				errors: result.error.flatten().fieldErrors,
				data: {
					firstName: formData.get("firstName")?.toString() ?? "",
					lastName: formData.get("lastName")?.toString() ?? "",
					email: formData.get("email")?.toString() ?? "",
					username: formData.get("username")?.toString() ?? "",
					birthDate: formData.get("birthDate")?.toString() ?? "",
					mobileNumber: formData.get("mobileNumber")?.toString() ?? "",
					street: formData.get("street")?.toString() ?? "",
					barangay: formData.get("barangay")?.toString() ?? "",
					city: formData.get("city")?.toString() ?? "",
					province: formData.get("province")?.toString() ?? "",
					userType: formData.get("userType")?.toString() ?? "",
				},
			});
		}

		const {
			firstName,
			lastName,
			email,
			username,
			password,
			birthDate,
			mobileNumber,
			street,
			barangay,
			city,
			province,
		} = result.data;

		try {
			// Check if email already exists
			const [existingEmailUser] = await db
				.select()
				.from(user)
				.where(eq(user.email, email))
				.limit(1);

			if (existingEmailUser) {
				return fail(400, {
					type: "register",
					message: "Email address is already registered",
					data: {
						firstName,
						lastName,
						email,
						username,
						birthDate,
						mobileNumber,
						street,
						barangay,
						city,
						province,
					},
				});
			}

			// Check if username already exists
			const [existingUsernameUser] = await db
				.select()
				.from(user)
				.where(eq(user.username, username))
				.limit(1);

			if (existingUsernameUser) {
				return fail(400, {
					type: "register",
					message: "Username is already taken",
					data: {
						firstName,
						lastName,
						email,
						username,
						birthDate,
						mobileNumber,
						street,
						barangay,
						city,
						province,
					},
				});
			}

			// Hash password
			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			});

			// Create address first
			const [newAddress] = await db
				.insert(address)
				.values({
					street: street || "",
					barangay,
					city,
					province,
				})
				.returning();

			// Create user
			const [newUser] = await db
				.insert(user)
				.values({
					firstName,
					lastName,
					email,
					username,
					passwordHash,
					birthDate: new Date(birthDate),
					mobileNumber,
					addressId: newAddress.id,
					status: "ACTIVE",
				})
				.returning();

			// Create specific user type
			await db.insert(buyer).values({ id: newUser.id });
			await db.insert(seller).values({ id: newUser.id });

			// Create session and log in the user
			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, newUser.id);

			setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (error) {
			console.error("Registration error:", error);

			if (error instanceof Response) {
				throw error;
			}

			return fail(500, {
				type: "register",
				message: "An unexpected error occurred. Please try again.",
				data: {
					firstName,
					lastName,
					email,
					username,
					birthDate,
					mobileNumber,
					street,
					barangay,
					city,
					province,
				},
			});
		}
		return redirect(302, "/");
	},
};

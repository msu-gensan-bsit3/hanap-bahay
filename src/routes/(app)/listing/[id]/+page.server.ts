import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { listing, listingQuery, user, userQuery } from "$lib/server/db/schema";

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.id);
	if (!id) {
		return error(400, "Invalid listing id");
	}

	const curListing = await db.query.listing.findFirst({
		...listingQuery,
		where: eq(listing.id, id),
	});

	if (!curListing) {
		return error(404, "Listing id not found");
	}

	let role: "anon" | "buyer" | "seller" | "agent" = "anon";

	if (locals.user) {
		const userData = await db.query.user.findFirst({
			columns: {},
			with: { agent: true, buyer: true, seller: true },
			where: eq(user.id, locals.user.id),
		});

		if (userData?.agent && userData.agent.id === curListing.agent.user.id) {
			role = "agent";
		} else if (userData?.seller && curListing.property.sellerId === userData.seller.id) {
			role = "seller";
		} else {
			role = "buyer";
		}

		if (role === "buyer" && !["up", "sold"].includes(curListing.status)) {
			return error(400, { message: "Listing not found" });
		}
	}

	return {
		listing: curListing,
		user: locals.user,
		role,
	};
};

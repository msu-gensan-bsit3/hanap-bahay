import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { listing, listingQuery } from "$lib/server/db/schema";

export const load: PageServerLoad = async ({ params }) => {
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

	return {
		listing: curListing,
	};
};

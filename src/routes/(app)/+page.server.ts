import { db } from "$lib/server/db";
import { agentQuery, listingQuery, propertyQuery, userQuery } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const listings = await db.query.listing.findMany({
		...listingQuery,
		with: {
			agent: agentQuery,
			property: { ...propertyQuery, columns: { ...propertyQuery.columns, sellerId: false } },
		},
	});

	return {
		listings,
	};
};

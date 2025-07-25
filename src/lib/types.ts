import { db } from "./server/db";
import { agentQuery, listingQuery, propertyQuery } from "./server/db/schema";

const listing = async () => {
	return (await db.query.listing.findFirst(listingQuery))!;
};
const clientListing = async () => {
	return (await db.query.listing.findFirst({
		...listingQuery,
		with: {
			property: { ...propertyQuery, columns: { ...propertyQuery.columns, sellerId: false } },
			agent: agentQuery,
		},
	}))!;
};

export type Listing = Awaited<ReturnType<typeof listing>>;
export type ClientListing = Awaited<ReturnType<typeof clientListing>>;

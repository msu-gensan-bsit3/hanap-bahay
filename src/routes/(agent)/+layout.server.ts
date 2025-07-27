import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { desc, eq } from "drizzle-orm";
import {
	agent,
	buyerQuery,
	listing,
	listingQuery,
	offer,
	offerQuery,
	propertyQuery,
} from "$lib/server/db/schema";
import { omit } from "$lib/utils";

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, "/");
	}

	const curAgent = await db.query.agent.findFirst({
		with: {
			listings: {
				...listingQuery,
				with: {
					property: propertyQuery,
					offers: {
						...offerQuery,
						with: {
							buyer: buyerQuery,
						},
						orderBy: [desc(offer.dateCreated)],
					},
				},
				orderBy: [desc(listing.dateCreated)],
			},
		},
		where: eq(agent.id, locals.user.id),
	});
	if (!curAgent) {
		return redirect(302, "/");
	}

	const userData = {
		user: locals.user,
		agent: omit(curAgent, "listings"),
	};

	return {
		userData,
		listings: curAgent.listings,
	};
};

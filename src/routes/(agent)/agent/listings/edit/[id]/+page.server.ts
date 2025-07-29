import { listingSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import { address, listing, property, propertyFeature, propertyTag } from "$lib/server/db/schema";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login");
	}

	const listingId = parseInt(params.id);
	if (isNaN(listingId)) {
		throw error(404, "Invalid listing ID");
	}

	// Get the listing with all related data
	const listingData = await db.query.listing.findFirst({
		where: and(eq(listing.id, listingId), eq(listing.agentId, locals.user.id)),
		with: {
			property: {
				with: {
					address: true,
					features: true,
					tags: true,
					photosUrl: true,
				},
			},
		},
	});

	if (!listingData) {
		throw error(404, "Listing not found or you don't have permission to edit it");
	}

	return {
		listing: listingData,
		form: {},
	};
};

export const actions: Actions = {
	"update-listing": async (event) => {
		const { request, locals, params } = event;

		if (!locals.user) {
			throw redirect(302, "/login");
		}

		if (!params.id) {
			return;
		}

		const listingId = parseInt(params.id);
		if (isNaN(listingId)) {
			return fail(400, { type: "update-listing", message: "Invalid listing ID" });
		}

		const formData = await request.formData();

		// Process form data to match schema expectations
		const rawData = Object.fromEntries(formData);

		// Convert features and tags from comma-separated strings to arrays
		const processedData = {
			...rawData,
			// Convert numeric fields
			price: parseFloat(rawData.price?.toString() ?? "0"),
			landArea: parseFloat(rawData.landArea?.toString() ?? "0"),
			floorArea: rawData.floorArea ? parseFloat(rawData.floorArea.toString()) : undefined,
			bedrooms: rawData.bedrooms ? parseInt(rawData.bedrooms.toString()) : undefined,
			bathrooms: rawData.bathrooms ? parseInt(rawData.bathrooms.toString()) : undefined,
			carSpace: rawData.carSpace ? parseInt(rawData.carSpace.toString()) : undefined,
			// Agent ID is not needed for edits since the agent is already associated
			agentId: locals.user.id,
			// Convert comma-separated strings to arrays
			features: rawData.features
				? rawData.features
						.toString()
						.split(",")
						.map((f) => f.trim())
						.filter((f) => f.length > 0)
				: undefined,
			tags: rawData.tags
				? rawData.tags
						.toString()
						.split(",")
						.map((t) => t.trim())
						.filter((t) => t.length > 0)
				: undefined,
			// Keep coordinates as strings for validation
			latitude: rawData.latitude?.toString() ?? "",
			longitude: rawData.longitude?.toString() ?? "",
		};

		const result = listingSchema.safeParse(processedData);

		if (!result.success) {
			return fail(400, {
				type: "update-listing",
				errors: result.error.flatten().fieldErrors,
				data: {
					name: formData.get("name")?.toString() ?? "",
					description: formData.get("description")?.toString() ?? "",
					type: formData.get("type")?.toString() ?? "",
					category: formData.get("category")?.toString() ?? "",
					price: parseFloat(formData.get("price")?.toString() ?? "0"),
					landArea: parseFloat(formData.get("landArea")?.toString() ?? "0"),
					floorArea: parseFloat(formData.get("floorArea")?.toString() ?? "0"),
					bedrooms: parseInt(formData.get("bedrooms")?.toString() ?? "0"),
					bathrooms: parseInt(formData.get("bathrooms")?.toString() ?? "0"),
					carSpace: parseInt(formData.get("carSpace")?.toString() ?? "0"),
					street: formData.get("street")?.toString() ?? "",
					barangay: formData.get("barangay")?.toString() ?? "",
					city: formData.get("city")?.toString() ?? "",
					province: formData.get("province")?.toString() ?? "",
					latitude: formData.get("latitude")?.toString() ?? "",
					longitude: formData.get("longitude")?.toString() ?? "",
					features: formData.get("features")?.toString() ?? "",
					tags: formData.get("tags")?.toString() ?? "",
				},
			});
		}

		try {
			// Get the existing listing to verify ownership
			const existingListing = await db.query.listing.findFirst({
				where: and(eq(listing.id, listingId), eq(listing.agentId, locals.user.id)),
				with: {
					property: {
						with: {
							address: true,
						},
					},
				},
			});

			if (!existingListing) {
				return fail(404, {
					type: "update-listing",
					message: "Listing not found or you don't have permission to edit it",
				});
			}

			const propertyId = existingListing.property.id;
			const addressId = existingListing.property.address.id;

			// Update address record
			await db
				.update(address)
				.set({
					street: result.data.street,
					barangay: result.data.barangay,
					city: result.data.city,
					province: result.data.province,
				})
				.where(eq(address.id, addressId));

			// Update property record
			await db
				.update(property)
				.set({
					name: result.data.name,
					description: result.data.description,
					type: result.data.type,
					category: result.data.category,
					landArea: result.data.landArea,
					floorArea: result.data.floorArea,
					bedrooms: result.data.bedrooms,
					bathrooms: result.data.bathrooms,
					carSpace: result.data.carSpace,
					price: result.data.price,
					location: {
						latitude: parseFloat(result.data.latitude),
						longitude: parseFloat(result.data.longitude),
					},
				})
				.where(eq(property.id, propertyId));

			// Update features - delete existing and insert new ones
			await db.delete(propertyFeature).where(eq(propertyFeature.propertyId, propertyId));
			if (result.data.features && result.data.features.length > 0) {
				const featureValues = result.data.features.map((feature) => ({
					propertyId,
					name: feature,
				}));
				await db.insert(propertyFeature).values(featureValues);
			}

			// Update tags - delete existing and insert new ones
			await db.delete(propertyTag).where(eq(propertyTag.propertyId, propertyId));
			if (result.data.tags && result.data.tags.length > 0) {
				const tagValues = result.data.tags.map((tag) => ({
					propertyId,
					name: tag,
				}));
				await db.insert(propertyTag).values(tagValues);
			}

			// Update listing status if needed (mark as under-review after edit)
			await db
				.update(listing)
				.set({
					status: "under-review",
					dateModified: new Date(),
				})
				.where(eq(listing.id, listingId));
		} catch (error) {
			console.error("Database error:", error);
			return fail(500, {
				type: "update-listing",
				message: "Failed to update listing. Please try again.",
			});
		}

		return redirect(302, "/agent/listings");
	},
};

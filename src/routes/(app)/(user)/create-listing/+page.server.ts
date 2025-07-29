import { listingSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import {
	address,
	agentQuery,
	listing,
	photosUrl,
	property,
	propertyFeature,
	propertyTag,
} from "$lib/server/db/schema";

import { listingHelp } from "$lib/server/services/ai-listing-tools";

import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const agents = await db.query.agent.findMany({
		...agentQuery,
	});

	return {
		agents,
		form: {},
	};
};

export const actions: Actions = {
	"create-listing": async (event) => {
		const { request, locals } = event;
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
			agentId: parseInt(rawData.agentId?.toString() ?? "0"),
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
			photosUrls: rawData.photosUrls
				? rawData.photosUrls
						.toString()
						.split(/[,\n]/)
						.map((url) => url.trim())
						.filter((url) => url.length > 0)
				: undefined,
			// Keep coordinates as strings for validation
			latitude: rawData.latitude?.toString() ?? "",
			longitude: rawData.longitude?.toString() ?? "",
		};

		const result = listingSchema.safeParse(processedData);

		if (!result.success) {
			return fail(400, {
				type: "create-listing",
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
					agentId: parseInt(formData.get("agentId")?.toString() ?? "0"),
					street: formData.get("street")?.toString() ?? "",
					barangay: formData.get("barangay")?.toString() ?? "",
					city: formData.get("city")?.toString() ?? "",
					province: formData.get("province")?.toString() ?? "",
					latitude: formData.get("latitude")?.toString() ?? "",
					longitude: formData.get("longitude")?.toString() ?? "",
					features: formData.get("features")?.toString() ?? "",
					tags: formData.get("tags")?.toString() ?? "",
					photosUrls: formData.get("photosUrls")?.toString() ?? "",
				},
			});
		}

		try {
			// Create address record first
			const [addressRecord] = await db
				.insert(address)
				.values({
					street: result.data.street,
					barangay: result.data.barangay,
					city: result.data.city,
					province: result.data.province,
				})
				.returning({ id: address.id });

			// Create property record
			const [propertyRecord] = await db
				.insert(property)
				.values({
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
					addressId: addressRecord.id,
					sellerId: locals.user!.id,
				})
				.returning({ id: property.id });

			// Insert features if provided
			if (result.data.features && result.data.features.length > 0) {
				const featureValues = result.data.features.map((feature) => ({
					propertyId: propertyRecord.id,
					name: feature,
				}));
				await db.insert(propertyFeature).values(featureValues);
			}

			// Insert tags if provided
			if (result.data.tags && result.data.tags.length > 0) {
				const tagValues = result.data.tags.map((tag) => ({
					propertyId: propertyRecord.id,
					name: tag,
				}));
				await db.insert(propertyTag).values(tagValues);
			}

			// Insert photo URLs if provided
			if (result.data.photosUrls && result.data.photosUrls.length > 0) {
				const photoValues = result.data.photosUrls.map((url) => ({
					propertyId: propertyRecord.id,
					url: url,
				}));
				await db.insert(photosUrl).values(photoValues).onConflictDoNothing();
			}

			// Create listing record
			await db.insert(listing).values({
				propertyId: propertyRecord.id,
				agentId: result.data.agentId,
				status: "submitted",
			});

			// Redirect to success page or listings page
		} catch (error) {
			console.error("Database error:", error);
			return fail(500, {
				type: "create-listing",
				message: "Failed to create listing. Please try again.",
			});
		}
		return redirect(302, "/dashboard");
	},

	"generate-ai-description": async ({ request }) => {
		const formData = await request.formData();
		const res = JSON.stringify(Object.fromEntries(formData));

		const aiDescription = await listingHelp(res, "description");
		if (aiDescription.err) {
			return fail(400, { type: "aiDescription", msg: aiDescription.err });
		}

		return {
			type: "aiDescription",
			description: aiDescription.msg,
		};
	},

	"generate-ai-price": async ({ request }) => {
		const formData = await request.formData();
		const res = JSON.stringify(Object.fromEntries(formData));

		const aiPrice = await listingHelp(res, "price");
		if (aiPrice.err) {
			return fail(400, { type: "aiPrice", msg: aiPrice.err });
		}

		return {
			type: "aiPrice",
			price: aiPrice.msg,
		};
	},
};

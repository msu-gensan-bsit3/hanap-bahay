<script lang="ts">
	import {
		ActionButtons,
		RecentLeads,
		RecentListings,
		StatsCards,
	} from "$lib/components/dashboard";
	import { toTitleCase } from "$lib/utils";

	let { data } = $props();

	// Calculate actual stats based on available data
	const stats = $derived({
		totalListings: data.listings.length,
		approvedListings: data.listings.filter((v) => v.status === "up").length,
		pendingReview: data.listings.filter((v) => v.status === "under-review").length,
		totalLeads: data.listings.map((v) => v.offers.length).reduce((sum, count) => sum + count, 0),
	});

	const recentListings = $derived(
		data.listings.slice(0, 4).map((v) => {
			const isLandProperty = ["commercial-lot", "residential-lot", "industrial-lot"].includes(
				v.property.category,
			);
			const area =
				(isLandProperty ? v.property.landArea : v.property.floorArea) || v.property.landArea;

			const details = [];
			if (v.property.bedrooms && v.property.bedrooms > 0) {
				details.push(`${v.property.bedrooms} BR`);
			}
			if (v.property.bathrooms && v.property.bathrooms > 0) {
				details.push(`${v.property.bathrooms} BA`);
			}
			if (area && area > 0) {
				details.push(`${area} sqm`);
			}

			return {
				id: v.id,
				title: v.property.name,
				details: details.join(" • "),
				price: `₱${v.property.price.toLocaleString()}`,
				status: toTitleCase(v.status),
				image: v.property.photosUrl.at(0)?.url || "/no-image.jpg",
			};
		}),
	);

	const recentLeads = $derived(
		data.listings
			.map((v) => v.offers.map((o) => ({ ...o, property: v.property })))
			.flat()
			.sort((a, b) => b.dateCreated.valueOf() - a.dateCreated.valueOf()) // Sort by newest first
			.slice(0, 4)
			.map((v) => {
				// Calculate days since the offer was created
				const daysSince = Math.floor(
					(Date.now() - v.dateCreated.valueOf()) / (1000 * 60 * 60 * 24),
				);
				const lastContact =
					daysSince === 0 ? "Today" : daysSince === 1 ? "Yesterday" : `${daysSince} days ago`;

				return {
					id: v.id,
					name: v.buyer.user.firstName + " " + v.buyer.user.lastName,
					interest: toTitleCase(v.property.category) + " in " + v.property.address.city,
					lastContact,
					status: toTitleCase(v.status),
				};
			}),
	);
</script>

<div class="container mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
	<!-- Header -->
	<div class="mb-6 lg:mb-8">
		<h1 class="text-2xl font-bold text-gray-900 lg:text-3xl">Agent Dashboard</h1>
		<p class="text-sm text-gray-600 lg:text-base">
			Welcome back, {data.userData.user.firstName}! Here's what's happening with your properties
			today.
		</p>
	</div>

	<!-- Action Buttons -->
	<div class="mb-6 lg:mb-8">
		<ActionButtons />
	</div>

	<!-- Stats Cards -->
	<div class="mb-8 lg:mb-10">
		<StatsCards {stats} />
	</div>

	<!-- Recent Activity Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
		<!-- Recent Listings -->
		<RecentListings listings={recentListings} />

		<!-- Recent Leads -->
		<RecentLeads leads={recentLeads} />
	</div>
</div>

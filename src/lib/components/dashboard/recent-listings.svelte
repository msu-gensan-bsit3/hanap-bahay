<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";

	interface Listing {
		id: number;
		title: string;
		details: string;
		price: string;
		status: string;
		image: string;
	}

	let { listings }: { listings: Listing[] } = $props();

	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case "approved":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "needs revision":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	let activeFilter = $state("all");
	const filters = [
		{ id: "all", label: "All" },
		{ id: "pending", label: "Pending" },
		{ id: "approved", label: "Approved" },
	];

	let filteredListings = $derived(
		activeFilter === "all"
			? listings
			: listings.filter((listing) => listing.status.toLowerCase() === activeFilter),
	);
</script>

<Card class="h-min">
	<CardHeader class="flex flex-row items-center justify-between">
		<CardTitle>Recent Listings</CardTitle>
		<div class="flex gap-8 text-sm">
			{#each filters as filter}
				<button
					class="transition-colors {activeFilter === filter.id
						? 'border-b border-blue-600 text-blue-600'
						: 'text-gray-500 hover:text-gray-700'} cursor-pointer pb-1"
					onclick={() => (activeFilter = filter.id)}
				>
					{filter.label}
				</button>
			{/each}
		</div>
	</CardHeader>
	<CardContent class="flex h-full flex-col justify-between px-0">
		<div>
			{#each filteredListings as listing}
				<div class="h-[2px] w-full bg-black/10"></div>
				<button
					class="flex h-23 w-full cursor-pointer items-center gap-4 p-4 text-start transition-colors hover:bg-black/5"
				>
					<!-- svelte-ignore hydration_attribute_changed -->
					<img src={listing.image} alt={listing.title} class="size-14 rounded-lg object-cover" />
					<div class="flex-1">
						<h4 class="text-[14px] font-medium text-gray-900">{listing.title}</h4>
						<p class="text-[12px] font-medium text-gray-500">{listing.details}</p>
						<p class="text-[14px] font-semibold text-gray-900">{listing.price}</p>
					</div>
					<Badge class={getStatusColor(listing.status)}>
						{listing.status}
					</Badge>
				</button>
			{/each}
			<div class="h-[1px] w-full bg-black/10"></div>
		</div>
		<button
			class="mt-4 cursor-pointer px-4 text-xs text-blue-600 transition-colors hover:text-blue-800"
			>View all listings</button
		>
	</CardContent>
</Card>

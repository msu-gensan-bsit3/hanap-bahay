<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";

	import CategoryFilter from "$lib/components/listings-page/filter-category.svelte";
	import PriceFilter from "$lib/components/listings-page/filter-price.svelte";
	import RoomsFilter from "$lib/components/listings-page/filter-babd.svelte";
	import TypeFilter from "$lib/components/listings-page/filter-type.svelte";

	import SearchAI from "$lib/components/listings-page/search-ai.svelte";
	import SortBy from "$lib/components/listings-page/sort-by.svelte";

	import ListingCard from "$lib/components/listings-page/listing-card.svelte";
	import SkeletonCard from "$lib/components/listings-page/skeleton-listing-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";

	import * as Pagination from "$lib/components/ui/pagination/index";

	import { RotateCcw } from "@lucide/svelte";

	// Filters
	let address = $state("");
	let saleType = $state("For Sale");

	let minPrice = $state(0);
	let maxPrice = $state(0);

	let bedrooms = $state(0);
	let exactBeds = $state(false);
	let bathrooms = $state(0);

	//
	let sortBy: string | undefined = $state();

	let { data } = $props();
	let { listings } = $derived(data);

	let filteredListings: typeof listings = $state([]);
	let loading = $state(false);
	let timeoutId: NodeJS.Timeout;

	// pagination
	const isDesktop = new MediaQuery("(min-width: 768px)");
	const perPage = 40;
	let pageNum = $state(1);

	const count = $derived(filteredListings.length);
	const totalPages = $derived(Math.ceil(count / perPage));
	const paginatedListings = $derived(
		filteredListings.slice((pageNum - 1) * perPage, pageNum * perPage)
	);

	// Initialize filteredListings
	$effect(() => {
		if (listings && filteredListings.length === 0) {
			filteredListings = listings;
		}
	});

	// Reset filters function
	function resetFilters() {
		address = "";
		saleType = "For Sale";
		minPrice = 0;
		maxPrice = 0;
		bedrooms = 0;
		exactBeds = false;
		bathrooms = 0;
		sortBy = undefined;
	}

	//
	$effect(() => {
		loading = true;
		const filterDeps = [
			sortBy,
			address,
			saleType,
			minPrice,
			maxPrice,
			bedrooms,
			bathrooms,
			exactBeds,
		];

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			filteredListings = listings
				.filter((listing) => {
					const property = listing.property;

					// Address filter - only apply if address is provided
					const listingAddress = Object.values(property.address)
						.slice(1)
						.filter((v) => v)
						.join(", ");
					const matchAddress = address.trim() === "" || 
						listingAddress.toLowerCase().includes(address.toLowerCase());

					// Sale type filter
					const matchType = saleType.toLowerCase().includes(property.type.toLowerCase());

					// Price filter
					let matchPrice = true;
					if (minPrice > 0 || maxPrice > 0) {
						if (maxPrice > 0) {
							matchPrice = property.price >= minPrice && property.price <= maxPrice;
						} else {
							matchPrice = property.price >= minPrice;
						}
					}

					// Bedrooms filter - only apply if bedrooms > 0
					const matchBeds = bedrooms === 0 || (exactBeds
						? property.bedrooms === bedrooms
						: property.bedrooms && property.bedrooms >= bedrooms);
					
					// Bathrooms filter - only apply if bathrooms > 0
					const matchBaths = bathrooms === 0 || 
						(property.bathrooms && property.bathrooms >= bathrooms);

					return matchAddress && matchType && matchPrice && matchBeds && matchBaths;
				})
				.sort((a, b) => {
					if (!sortBy) {
						return 0;
					}

					if (sortBy !== "Highest Price") {
						return a.property.price - b.property.price;
					} else {
						return b.property.price - a.property.price;
					}
				});
			
			// Reset to first page when filters change
			pageNum = 1;
			loading = false;
		}, 100);
	});
</script>

<div class="w-full items-center space-y-2">
	<!-- Filters -->
	<div class="mx-auto flex h-12 w-full items-center gap-1 border-b-1 px-4">
		<!-- Search Bar -->
		<div class="relative flex-grow">
			<Input bind:value={address} />
		</div>
		<TypeFilter bind:saleType />
		<PriceFilter bind:minPrice bind:maxPrice />
		<RoomsFilter bind:bedrooms bind:exactBeds bind:bathrooms />
		<!-- <CategoryFilter bind:saleType /> -->
		<Button class="flex" onclick={resetFilters}>
			<RotateCcw />
			Reset
		</Button>
	</div>

	<!-- Content -->
	<div class="flex items-center justify-between px-4">
		<div>
			<h1 class="text-3xl leading-tight font-bold tracking-tight">
				{#if address !== ""}
					Showing results for "{address}"
				{:else}
					Real Estate
				{/if}
			</h1>
			<div class="flex items-center gap-3">
				<p class="text-sm leading-tight text-muted-foreground">
					{count} results {#if totalPages > 1}(Page {pageNum} of {totalPages}){/if}
				</p>
				<SortBy bind:sortBy />
			</div>
		</div>
		<SearchAI />
	</div>
	<div class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2">
		{#if loading}
			{#each { length: 6 }}
				<SkeletonCard />
			{/each}
		{:else}
			{#each paginatedListings as listing (listing.id)}
				<ListingCard {...listing} />
			{/each}
		{/if}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex justify-center items-center gap-2 px-4 py-6">
			<Button
				variant="outline"
				size="sm"
				disabled={pageNum <= 1}
				onclick={() => pageNum = Math.max(1, pageNum - 1)}
			>
				Previous
			</Button>
			
			<span class="text-sm text-muted-foreground">
				Page {pageNum} of {totalPages}
			</span>
			
			<Button
				variant="outline"
				size="sm"
				disabled={pageNum >= totalPages}
				onclick={() => pageNum = Math.min(totalPages, pageNum + 1)}
			>
				Next
			</Button>
		</div>
	{/if}
</div>

<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";

	import CategoryFilter from "$lib/components/listings-page/filter-category.svelte";
	import PriceFilter from "$lib/components/listings-page/filter-price.svelte";
	import RoomsFilter from "$lib/components/listings-page/filter-babd.svelte";
	import TypeFilter from "$lib/components/listings-page/filter-type.svelte";

	import SearchAI from "$lib/components/listings-page/search-ai.svelte";
	import SortBy from "$lib/components/listings-page/sort-by.svelte";

	import CarouselListingCard from "$lib/components/listings-page/carousel-listing-card.svelte";
	import SkeletonCard from "$lib/components/listings-page/skeleton-listing-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";

	import * as Pagination from "$lib/components/ui/pagination/index";

	import { RotateCcw } from "@lucide/svelte";

	// Filters
	let address = $state("");
	let saleType = $state("For Sale");
	let category = $state("all");

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
	const perPage = 20;
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
		category = "all";
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
			category,
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

					// Category filter - only apply if category is not "all"
					const matchCategory = category === "all" || property.category === category;

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

					return matchAddress && matchType && matchCategory && matchPrice && matchBeds && matchBaths;
				})
				.sort((a, b) => {
					if (!sortBy) {
						return 0;
					}

					switch (sortBy) {
						case "Highest Price":
							return b.property.price - a.property.price;
						case "Lowest Price":
							return a.property.price - b.property.price;
						case "Newest First":
							return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
						case "Oldest First":
							return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
						default:
							return 0;
					}
				});
			
			// Reset to first page when filters change
			pageNum = 1;
			loading = false;
		}, 100);
	});
</script>

<div class="w-full min-h-screen bg-background">
	<!-- Filters -->
	<div class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
		<div class="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
			<!-- Search Bar -->
			<div class="relative flex-grow max-w-md">
				<Input bind:value={address} placeholder="Search by location..." class="h-10" />
			</div>
			<CategoryFilter bind:category />
			<TypeFilter bind:saleType />
			<PriceFilter bind:minPrice bind:maxPrice />
			<RoomsFilter bind:bedrooms bind:exactBeds bind:bathrooms />
			<Button variant="outline" class="flex items-center gap-2" onclick={resetFilters}>
				<RotateCcw class="h-4 w-4" />
				Reset
			</Button>
		</div>
	</div>

	<!-- Content -->
	<div class="mx-auto max-w-7xl px-4 py-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-3xl font-bold tracking-tight">
					{#if address !== ""}
						Results for "{address}"
					{:else}
						All Properties
					{/if}
				</h1>
				<div class="flex items-center gap-4 mt-2">
					<p class="text-sm text-muted-foreground">
						{count} properties {#if totalPages > 1}• Page {pageNum} of {totalPages}{/if}
					</p>
					<SortBy bind:sortBy />
				</div>
			</div>
			<SearchAI />
		</div>

		<!-- Listings Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
			{#if loading}
				{#each { length: 8 }}
					<div class="h-128">
						<SkeletonCard />
					</div>
				{/each}
			{:else if paginatedListings.length > 0}
				{#each paginatedListings as listing (listing.id)}
					<div class="h-128">
						<CarouselListingCard {...listing} />
					</div>
				{/each}
			{:else}
				<div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
					<div class="text-muted-foreground mb-4">
						<svg class="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
						<h3 class="text-lg font-medium mb-2">No properties found</h3>
						<p class="text-sm">Try adjusting your search criteria or filters</p>
					</div>
					<Button onclick={resetFilters} variant="outline">
						<RotateCcw class="h-4 w-4 mr-2" />
						Clear all filters
					</Button>
				</div>
			{/if}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex justify-center items-center gap-4 mt-12 pt-8 border-t">
				<Button
					variant="outline"
					size="sm"
					disabled={pageNum <= 1}
					onclick={() => pageNum = Math.max(1, pageNum - 1)}
				>
					Previous
				</Button>
				
				<div class="flex items-center gap-2">
					{#if totalPages <= 7}
						{#each Array(totalPages) as _, i}
							<Button
								variant={pageNum === i + 1 ? "default" : "outline"}
								size="sm"
								class="w-10"
								onclick={() => pageNum = i + 1}
							>
								{i + 1}
							</Button>
						{/each}
					{:else}
						<!-- Show simplified pagination for many pages -->
						<span class="text-sm text-muted-foreground px-3 py-2">
							Page {pageNum} of {totalPages}
						</span>
					{/if}
				</div>
				
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
</div>

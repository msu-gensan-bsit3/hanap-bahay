<script lang="ts">
	import RoomsFilter from "$lib/components/listings-page/filter-babd.svelte";
	import CategoryFilter from "$lib/components/listings-page/filter-category.svelte";
	import PriceFilter from "$lib/components/listings-page/filter-price.svelte";
	import TypeFilter from "$lib/components/listings-page/filter-type.svelte";

	import SearchAI from "$lib/components/listings-page/search-ai.svelte";
	import SortBy from "$lib/components/listings-page/sort-by.svelte";

	import CarouselListingCard from "$lib/components/listings-page/carousel-listing-card.svelte";
	import SkeletonCard from "$lib/components/listings-page/skeleton-listing-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";

	import { RotateCcw } from "@lucide/svelte";

	// Filters
	let address = $state("");
	let saleType = $state("All Types");
	let category = $state("all");

	let minPrice = $state(0);
	let maxPrice = $state(0);

	let bedrooms = $state(0);
	let exactBeds = $state(false);
	let bathrooms = $state(0);
	let exactBaths = $state(false);

	let sortBy: string = $state("Default");

	let { data } = $props();
	let { listings } = $derived(data);

	// svelte-ignore state_referenced_locally
	let filteredListings = $state(listings);
	let loading = $state(false);
	let timeoutId: NodeJS.Timeout;

	// pagination
	const perPage = 24;
	let pageNum = $state(1);

	const count = $derived(filteredListings.length);
	const totalPages = $derived(Math.ceil(count / perPage));
	const paginatedListings = $derived(
		filteredListings.slice((pageNum - 1) * perPage, pageNum * perPage),
	);

	// Reset filters function
	function resetFilters() {
		address = "";
		saleType = "All Types";
		category = "all";
		minPrice = 0;
		maxPrice = 0;
		bedrooms = 0;
		exactBeds = false;
		exactBaths = false;
		bathrooms = 0;
		sortBy = "Default";
	}

	//
	$effect(() => {
		loading = true;
		const _ = [
			sortBy,
			address,
			saleType,
			category,
			minPrice,
			maxPrice,
			bedrooms,
			bathrooms,
			exactBeds,
			exactBaths,
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
					const matchAddress =
						address.trim() === "" || listingAddress.toLowerCase().includes(address.toLowerCase());

					// Sale type filter
					const matchType =
						saleType === "All Types" ||
						saleType.toLowerCase().includes(property.type.toLowerCase());

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
					const matchBeds =
						bedrooms === 0 ||
						(exactBeds
							? property.bedrooms === bedrooms
							: property.bedrooms && property.bedrooms >= bedrooms);

					// Bathrooms filter - only apply if bathrooms > 0
					const matchBaths =
						bathrooms === 0 ||
						(exactBaths
							? property.bathrooms === bathrooms
							: property.bathrooms && property.bathrooms >= bathrooms);

					return (
						matchAddress && matchType && matchCategory && matchPrice && matchBeds && matchBaths
					);
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
		}, 250);
	});
</script>

<div class="min-h-screen w-full bg-background">
	<!-- Filters -->
	<div
		class="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="mx-auto max-w-7xl px-4 py-3">
			<!-- Mobile: Stacked layout -->
			<div class="flex flex-col gap-3 lg:hidden">
				<!-- Search Bar -->
				<div class="relative">
					<Input bind:value={address} placeholder="Search by location..." class="h-10" />
				</div>
				<!-- Filter Row 1 -->
				<div class="flex flex-wrap items-center gap-2">
					<CategoryFilter bind:category />
					<TypeFilter bind:saleType />
					<PriceFilter bind:minPrice bind:maxPrice />
				</div>
				<!-- Filter Row 2 -->
				<div class="flex flex-wrap items-center gap-2">
					<RoomsFilter bind:bedrooms bind:exactBeds bind:bathrooms bind:exactBaths />
					<Button variant="outline" class="flex items-center gap-2" onclick={resetFilters}>
						<RotateCcw class="h-4 w-4" />
						<span class="hidden sm:inline">Reset</span>
					</Button>
				</div>
			</div>

			<!-- Desktop: Single row layout -->
			<div class="hidden items-center gap-2 lg:flex">
				<!-- Search Bar -->
				<div class="relative max-w-md flex-grow">
					<Input bind:value={address} placeholder="Search by location..." class="h-10" />
				</div>
				<CategoryFilter bind:category />
				<TypeFilter bind:saleType />
				<PriceFilter bind:minPrice bind:maxPrice />
				<RoomsFilter bind:bedrooms bind:exactBeds bind:bathrooms bind:exactBaths />
				<Button variant="outline" class="flex items-center gap-2" onclick={resetFilters}>
					<RotateCcw class="h-4 w-4" />
					Reset
				</Button>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
		<div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
			<div class="flex-grow">
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
					{#if address !== ""}
						Results for "{address}"
					{:else}
						All Properties
					{/if}
				</h1>
				<div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
					<p class="text-sm text-muted-foreground">
						{count} properties {#if totalPages > 1}• Page {pageNum} of {totalPages}{/if}
					</p>
					<SortBy bind:sortBy />
				</div>
			</div>
			<div class="flex-shrink-0">
				<SearchAI />
			</div>
		</div>

		<!-- Listings Grid -->
		<div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
			{#if loading}
				{#each { length: 12 }}
					<div class="">
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
					<div class="mb-4 text-muted-foreground">
						<svg
							class="mx-auto mb-4 h-16 w-16"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"
								d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
							/>
						</svg>
						<h3 class="mb-2 text-lg font-medium">No properties found</h3>
						<p class="text-sm text-muted-foreground">
							Try adjusting your search criteria or filters
						</p>
					</div>
					<Button onclick={resetFilters} variant="outline">
						<RotateCcw class="mr-2 h-4 w-4" />
						Clear all filters
					</Button>
				</div>
			{/if}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div
				class="mt-8 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:mt-12 sm:pt-8"
			>
				<div class="flex items-center gap-2 sm:gap-4">
					<Button
						variant="outline"
						size="sm"
						disabled={pageNum <= 1}
						onclick={() => (pageNum = Math.max(1, pageNum - 1))}
						class="px-3 py-2 text-sm"
					>
						<span class="hidden sm:inline">Previous</span>
						<span class="sm:hidden">Prev</span>
					</Button>

					<div class="flex items-center gap-1 sm:gap-2">
						{#if totalPages <= 7}
							{#each Array(totalPages) as _, i}
								<Button
									variant={pageNum === i + 1 ? "default" : "outline"}
									size="sm"
									class="h-8 w-8 p-0 text-sm sm:h-10 sm:w-10"
									onclick={() => (pageNum = i + 1)}
								>
									{i + 1}
								</Button>
							{/each}
						{:else}
							<!-- Show simplified pagination for many pages -->
							<span class="px-2 py-2 text-xs text-muted-foreground sm:px-3 sm:text-sm">
								Page {pageNum} of {totalPages}
							</span>
						{/if}
					</div>

					<Button
						variant="outline"
						size="sm"
						disabled={pageNum >= totalPages}
						onclick={() => (pageNum = Math.min(totalPages, pageNum + 1))}
						class="px-3 py-2 text-sm"
					>
						<span class="hidden sm:inline">Next</span>
						<span class="sm:hidden">Next</span>
					</Button>
				</div>
			</div>
		{/if}
	</div>
</div>

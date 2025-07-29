<script lang="ts">
	import RoomsFilter from "$lib/components/listings-page/filter-babd.svelte";
	import CategoryFilter from "$lib/components/listings-page/filter-category.svelte";
	import LocationFilter from "$lib/components/listings-page/filter-location.svelte";
	import PriceFilter from "$lib/components/listings-page/filter-price.svelte";
	import StatusFilter from "$lib/components/listings-page/filter-status.svelte";
	import TypeFilter from "$lib/components/listings-page/filter-type.svelte";

	import SortBy from "$lib/components/listings-page/sort-by.svelte";
	import ListingMap from "$lib/components/listings-page/listing-map.svelte";
	import ListingMapSkeleton from "$lib/components/listings-page/listing-map-skeleton.svelte";

	import CarouselListingCard from "$lib/components/listings-page/carousel-listing-card.svelte";
	import SkeletonCard from "$lib/components/listings-page/skeleton-listing-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";

	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";
	import { ChevronDown, ChevronUp, Funnel, RotateCcw, Search, Grid3X3, Map } from "@lucide/svelte";
	import { tick, untrack } from "svelte";

	// View toggle state
	let viewMode = $state("grid"); // "grid" or "map"

	// Filters - Initialize from URL params
	let searchTerm = $state(page.url.searchParams.get("search") || "");
	let location = $state(page.url.searchParams.get("location") || "All Locations");
	let saleType = $state(page.url.searchParams.get("saleType") || "All Types");
	let category = $state(page.url.searchParams.get("category") || "all");
	let status = $state(page.url.searchParams.get("status") || "all");

	let minPrice = $state(parseInt(page.url.searchParams.get("minPrice") || "0"));
	let maxPrice = $state(parseInt(page.url.searchParams.get("maxPrice") || "0"));

	let bedrooms = $state(parseInt(page.url.searchParams.get("bedrooms") || "0"));
	let exactBeds = $state(page.url.searchParams.get("exactBeds") === "true");
	let bathrooms = $state(parseInt(page.url.searchParams.get("bathrooms") || "0"));
	let exactBaths = $state(page.url.searchParams.get("exactBaths") === "true");

	let sortBy: string = $state(page.url.searchParams.get("sort") || "Default");

	// Mobile filter visibility toggle
	let showFilters = $state(false);

	let { data } = $props();

	let loading = $state(true);
	let timeoutId: NodeJS.Timeout;

	// pagination
	const perPage = 24;
	let pageNum = $derived.by(() => {
		return parseInt(page.url.searchParams.get("page") || "1");
	});

	function filter(listings: Awaited<typeof data.listings>) {
		return listings
			.filter((listing) => {
				const property = listing.property;

				// Search term filter - search in name, description, features, and address
				const propertyName = property.name?.toLowerCase() || "";
				const listingDescription = property.description?.toLowerCase() || "";
				const listingFeatures =
					property.features
						?.map((f: { name: string }) => f.name)
						.join(" ")
						.toLowerCase() || "";
				const listingAddress = Object.values(property.address)
					.slice(1)
					.filter((v) => v)
					.join(", ")
					.toLowerCase();
				const floorArea = property.floorArea?.toString() || "";
				const landArea = property.landArea?.toString() || "";

				const matchesSearch =
					searchTerm.trim() === "" ||
					propertyName.includes(searchTerm.toLowerCase()) ||
					listingDescription.includes(searchTerm.toLowerCase()) ||
					listingFeatures.includes(searchTerm.toLowerCase()) ||
					listingAddress.includes(searchTerm.toLowerCase()) ||
					floorArea.includes(searchTerm.toLowerCase()) ||
					landArea.includes(searchTerm.toLowerCase());

				// Location filter
				const matchesLocation =
					location === "All Locations" || listingAddress.includes(location.toLowerCase());

				// Sale type filter
				const matchType =
					saleType === "All Types" || saleType.toLowerCase().includes(property.type.toLowerCase());

				// Category filter - only apply if category is not "all"
				const matchCategory = category === "all" || property.category === category;

				// Status filter - only apply if status is not "all"
				const matchStatus = status === "all" || listing.status === status;

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
					matchesSearch &&
					matchesLocation &&
					matchType &&
					matchCategory &&
					matchStatus &&
					matchPrice &&
					matchBeds &&
					matchBaths
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
	}

	// Reset filters function
	function resetFilters() {
		searchTerm = "";
		location = "All Locations";
		saleType = "All Types";
		category = "all";
		status = "all";
		minPrice = 0;
		maxPrice = 0;
		bedrooms = 0;
		exactBeds = false;
		exactBaths = false;
		bathrooms = 0;
		sortBy = "Default";
		updateURL();
	}

	// Update URL with current filter values
	async function updateURL() {
		const url = new URL(page.url);

		// Clear existing params
		url.searchParams.delete("search");
		url.searchParams.delete("location");
		url.searchParams.delete("saleType");
		url.searchParams.delete("category");
		url.searchParams.delete("status");
		url.searchParams.delete("minPrice");
		url.searchParams.delete("maxPrice");
		url.searchParams.delete("bedrooms");
		url.searchParams.delete("bathrooms");
		url.searchParams.delete("exactBeds");
		url.searchParams.delete("exactBaths");
		url.searchParams.delete("sort");
		url.searchParams.delete("page");

		// Set params only if they're not default values
		if (searchTerm.trim() !== "") {
			url.searchParams.set("search", searchTerm);
		}
		if (location !== "All Locations") {
			url.searchParams.set("location", location);
		}
		if (saleType !== "All Types") {
			url.searchParams.set("saleType", saleType);
		}
		if (category !== "all") {
			url.searchParams.set("category", category);
		}
		if (status !== "all") {
			url.searchParams.set("status", status);
		}
		if (minPrice > 0) {
			url.searchParams.set("minPrice", minPrice.toString());
		}
		if (maxPrice > 0) {
			url.searchParams.set("maxPrice", maxPrice.toString());
		}
		if (bedrooms > 0) {
			url.searchParams.set("bedrooms", bedrooms.toString());
		}
		if (bathrooms > 0) {
			url.searchParams.set("bathrooms", bathrooms.toString());
		}
		if (exactBeds) {
			url.searchParams.set("exactBeds", "true");
		}
		if (exactBaths) {
			url.searchParams.set("exactBaths", "true");
		}
		if (sortBy !== "Default") {
			url.searchParams.set("sort", sortBy);
		}
		untrack(() => {
			if (pageNum > 1) {
				url.searchParams.set("page", pageNum.toString());
			}
		});

		await tick();
		replaceState(url, {});
	}

	$effect(() => {
		loading = true;
		// Trigger re-filtering when any filter changes
		[
			sortBy,
			searchTerm,
			location,
			saleType,
			category,
			status,
			minPrice,
			maxPrice,
			bedrooms,
			bathrooms,
			exactBeds,
			exactBaths,
		];

		pageNum = 1;

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			// Reset to first page when filters change
			loading = false;
		}, 250);

		updateURL();
	});
</script>

<svelte:head>
	<title>Property Listings - Find Your Perfect Home</title>
	<meta
		name="description"
		content="Browse our extensive collection of property listings. Find homes, condos, and commercial properties for sale or rent in your desired location."
	/>
</svelte:head>

<div class="min-h-screen w-full bg-background">
	<!-- Filters -->
	<div
		class="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="mx-auto max-w-7xl px-4 py-3">
			<!-- Mobile: Stacked layout -->
			<div class="flex flex-col gap-3 min-[1170px]:hidden">
				<!-- Mobile Filter Toggle Button -->
				<div class="flex items-center justify-between">
					<div class="relative flex-1">
						<Search
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							bind:value={searchTerm}
							placeholder="Search properties by name, location, features..."
							class="h-10 pl-9"
						/>
					</div>
					<Button
						variant="outline"
						size="sm"
						class="ml-2 flex items-center gap-2"
						onclick={() => (showFilters = !showFilters)}
					>
						<Funnel class="h-4 w-4" />
						<span class="hidden sm:inline">Filters</span>
						{#if showFilters}
							<ChevronUp class="h-4 w-4" />
						{:else}
							<ChevronDown class="h-4 w-4" />
						{/if}
					</Button>
				</div>

				<!-- Collapsible Filters -->
				{#if showFilters}
					<div class="flex flex-col gap-3">
						<!-- Filter Row 1 -->
						<div class="flex flex-wrap items-center gap-2">
							<div class="min-w-0 flex-1">
								<LocationFilter bind:location />
							</div>
							<CategoryFilter bind:category />
							<StatusFilter bind:status />
							<TypeFilter bind:saleType />
						</div>
						<!-- Filter Row 2 -->
						<div class="flex flex-wrap items-center gap-2">
							<PriceFilter bind:minPrice bind:maxPrice />
							<RoomsFilter bind:bedrooms bind:exactBeds bind:bathrooms bind:exactBaths />
							<Button variant="outline" class="flex items-center gap-2" onclick={resetFilters}>
								<RotateCcw class="h-4 w-4" />
								<span class="hidden sm:inline">Reset</span>
							</Button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Desktop: Single row layout -->
			<div class="hidden items-center gap-2 min-[1170px]:flex">
				<!-- Search Bar -->
				<div class="relative w-[400%] max-w-lg min-w-40 flex-grow">
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						bind:value={searchTerm}
						placeholder="Search properties by name, location, features..."
						class="h-10 pl-9"
					/>
				</div>
				<LocationFilter bind:location />
				<CategoryFilter bind:category />
				<StatusFilter bind:status />
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
	{#await data.listings}
		<!-- Loading state -->
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
			<div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div class="flex-grow">
					<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">All Properties</h1>
					<div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
						<p class="text-sm text-muted-foreground">Loading properties...</p>
					</div>
				</div>
			</div>

			<!-- Loading Grid -->
			<div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
				{#each { length: 12 } as _, i (i)}
					<div class="">
						<SkeletonCard />
					</div>
				{/each}
			</div>
		</div>
	{:then listings}
		<!-- Content loaded successfully -->
		{@const filteredListings = filter(listings)}
		{@const count = filteredListings.length}
		{@const totalPages = Math.ceil(count / perPage)}
		{@const paginatedListings = filteredListings.slice((pageNum - 1) * perPage, pageNum * perPage)}

		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
			<div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div class="flex-grow">
					<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
						{#if searchTerm !== ""}
							Results for "{searchTerm}"
						{:else}
							All Properties
						{/if}
					</h1>
					<div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
						<p class="text-sm text-muted-foreground">
							{count} properties {#if totalPages > 1}• Page {pageNum} of {totalPages}{/if}
						</p>
						<div class="flex items-center gap-2">
							<SortBy bind:sortBy />
							<!-- View Toggle -->
							<div class="flex items-center border rounded-md">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									class="h-8 px-2 rounded-r-none border-0"
									onclick={() => (viewMode = "grid")}
								>
									<Grid3X3 class="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "map" ? "default" : "ghost"}
									size="sm"
									class="h-8 px-2 rounded-l-none border-0"
									onclick={() => (viewMode = "map")}
								>
									<Map class="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Content Layout - Grid or Map View -->
			{#if viewMode === "grid"}
				<!-- Grid View - Original Layout -->
				<div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
					{#if loading}
						{#each { length: 12 } as _, i (i)}
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
			{:else}
				<!-- Map View - Split Layout -->
				<div class="flex gap-4 h-[calc(100vh-280px)] min-h-[600px]">
					<!-- Map Section - 50% width -->
					<div class="w-2/3">
						{#if loading}
							<ListingMapSkeleton />
						{:else}
							<ListingMap listings={filteredListings} />
						{/if}
					</div>

					<!-- Listings Section - 50% width -->
					<div class="w-1/3 overflow-y-auto">
						{#if loading}
							<div class="grid grid-cols-1 gap-4">
								{#each { length: 6 } as _, i (i)}
									<div class="">
										<SkeletonCard />
									</div>
								{/each}
							</div>
						{:else if paginatedListings.length > 0}
							<div class="grid grid-cols-1 gap-4">
								{#each paginatedListings as listing (listing.id)}
									<div class="h-auto">
										<CarouselListingCard {...listing} />
									</div>
								{/each}
							</div>
						{:else}
							<div class="flex flex-col items-center justify-center py-12 text-center h-full">
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
				</div>
			{/if}

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
								{#each Array(totalPages) as _, i (i)}
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
	{:catch error}
		<!-- Error state -->
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<div class="mb-4 text-muted-foreground">
					<svg class="mx-auto mb-4 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
					<h3 class="mb-2 text-lg font-medium">Failed to load properties</h3>
					<p class="text-sm text-muted-foreground">
						{error.message}
					</p>
				</div>
				<Button onclick={() => window.location.reload()} variant="outline">Try again</Button>
			</div>
		</div>
	{/await}
</div>

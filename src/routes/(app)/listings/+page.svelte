<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";

	import CategoryFilter from '$lib/components/listings-page/filter-category.svelte';
	import PriceFilter from '$lib/components/listings-page/filter-price.svelte';
	import RoomsFilter from '$lib/components/listings-page/filter-babd.svelte';
	import TypeFilter from '$lib/components/listings-page/filter-type.svelte';

	import SearchAI from '$lib/components/listings-page/search-ai.svelte';
	import SortBy from '$lib/components/listings-page/sort-by.svelte';

	import ListingCard from '$lib/components/listings-page/listing-card.svelte';
	import SkeletonCard from'$lib/components/listings-page/skeleton-listing-card.svelte';

	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';

	import * as Pagination from "$lib/components/ui/pagination/index"

	import { Heart } from '@lucide/svelte';

	// Filters
	let address = $state("")
	let saleType = $state("For Sale")

	let minPrice = $state(0)
	let maxPrice = $state(0)

	let bedrooms = $state(0)
	let exactBeds = $state(false)
	let bathrooms = $state(0)

	//
	let sortBy = $state("Highest Price")

	let { data } = $props();
	let { listings } = $derived(data);

	let filteredListings = $state(listings)
	let loading = $state(false)
	let timeoutId

	// pagination
	const isDesktop = new MediaQuery("(min-width: 768px)")

	const count = $derived(filteredListings.length)
	const perPage = 18

	//
	$effect(() => {
		const filterDeps = [sortBy, address, saleType, minPrice, maxPrice, bedrooms, bathrooms, exactBeds]
		loading = true

		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			filteredListings = listings.filter(listing => {
				const property = listing.property

				const listingAddress = Object.values(property.address).slice(1).filter(v => v).join(', ')
				const matchAddress = listingAddress.toLowerCase().includes(address.toLowerCase())

				const matchType = saleType.toLowerCase().includes(property.type)

				let matchPrice = false
				if (maxPrice > 0) {
					matchPrice = property.price >= minPrice && property.price <= maxPrice
				} else {
					matchPrice = property.price >= minPrice
				}

				const matchBeds = exactBeds ? property.bedrooms === bedrooms : property.bedrooms >= bedrooms
				const matchBaths = property.bathrooms ? property.bathrooms >= bathrooms : false

				return matchAddress && matchType && matchType && matchPrice && matchBeds && matchBaths
			}).sort((a,b) => {
				if (sortBy !== "Highest Price") {
					a.property.price - b.property.price
				} else {
					b.property.price - a.property.price
				}
			})
			loading = false
		}, 500)
	})
</script>

<div class="w-full items-center space-y-2">
	<!-- Filters -->
	<div class="w-full h-12 border-b-1 flex items-center px-4 mx-auto gap-1">
		<!-- Search Bar -->
		<div class="relative flex-grow">
			<Input
				bind:value={address}
			/>
		</div>
		<TypeFilter
			bind:saleType={saleType}
		/>
		<PriceFilter
			bind:minPrice={minPrice}
			bind:maxPrice={maxPrice}
		/>
		<RoomsFilter
			bind:bedrooms={bedrooms}
			bind:exactBeds={exactBeds}
			bind:bathrooms={bathrooms}
		/>
		<CategoryFilter />
		<Button class="flex">
			<Heart />
			Save
		</Button>
	</div>

	<!-- Content -->
	<div class="flex items-center justify-between px-4">
		<div>
			<h1 class="text-3xl font-bold tracking-tight leading-tight">
				{#if address !== ""}
					Showing results for "{ address }"
				{:else}
					Real Estate
				{/if}
			</h1>
			<div class="flex items-center gap-3">
				<p class="text-muted-foreground text-sm leading-tight">
					{ filteredListings.length } results
				</p>
				<SortBy bind:sortBy={ sortBy } />
			</div>
		</div>
		<SearchAI />
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2 px-4 gap-4">

		{#if loading}
			{#each { length: 6 }}
				<SkeletonCard />
			{/each}
		{:else}
			{#each filteredListings as listing (listing.id)}
				<ListingCard {...listing} />
			{/each}
		{/if}
	</div>
</div>
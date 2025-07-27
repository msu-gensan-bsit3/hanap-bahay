<script lang="ts">
	import AskAi from "$lib/components/ask-ai.svelte";
	import CarouselListingCard from "$lib/components/listings-page/carousel-listing-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";
	import { Label } from "$lib/components/ui/label/index";

	import * as Carousel from "$lib/components/ui/carousel/index.js";

	import { ChevronLast, Search } from "@lucide/svelte";

	let { data } = $props();
	let { listings } = $derived(data);

	// Split listings for different carousels
	const featuredListings = $derived(
		listings.slice(0, Math.min(8, Math.floor(listings.length * 0.6))),
	);
	const nearbyListings = $derived(listings.slice(Math.min(8, Math.floor(listings.length * 0.6))));
</script>

<div
	class="relative w-full bg-[url(https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iU07NrehBC9I/v0/-1x-1.webp)] bg-cover bg-center bg-no-repeat pb-5"
>
	<!-- Overlay for better text readability -->
	<div class="absolute inset-0 bg-black/40"></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="container mx-auto py-16 lg:py-24">
			<div class="mx-auto max-w-4xl text-center">
				<h1
					class="mb-8 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
				>
					In
					<span class="bg-gradient-to-r from-amber-300 to-red-500 bg-clip-text text-transparent">
						JuanHomes
					</span>
					you can find the
					<span class="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
						one
					</span>
					which feels like
					<span class="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
						home
					</span>
				</h1>

				<div class="mx-auto mt-20 max-w-2xl">
					<div class="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-xs">
						<form action="/listings" method="get" class="space-y-4">
							<div class="text-center">
								<Label class="text-lg font-medium text-gray-900">What are you looking for?</Label>
							</div>

							<div class="flex gap-2">
								<Input
									name="search"
									placeholder="Search by location, property type, or keywords..."
									class="h-11 flex-1 border-gray-200 text-base focus:border-primary focus:ring-1 focus:ring-primary"
								/>
								<Button type="submit" size="lg" class="h-11 px-6">
									<Search class="h-4 w-4" />
								</Button>
							</div>

							<div class="flex justify-center">
								<div class="inline-flex rounded-lg bg-gray-100 p-1">
									<Button size="sm" class="h-8 rounded-md px-4" variant="default">For Rent</Button>
									<Button size="sm" class="h-8 rounded-md px-4" variant="ghost">For Sale</Button>
									<Button size="sm" class="h-8 rounded-md px-4" variant="ghost">For Lease</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Featured Listings Carousel -->
<div class="w-full bg-background px-4">
	<Carousel.Root class="mx-auto max-w-screen-xl space-y-4 py-12">
		<div class="flex w-full items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold tracking-tight">Featured Listings</h2>
				<p class="text-sm text-muted-foreground">{featuredListings.length} premium properties</p>
			</div>
			<div class="mx-3 inline-flex gap-6">
				<Carousel.Previous />
				<Carousel.Next />
			</div>
		</div>
		<Carousel.Content class="-ml-2 md:-ml-4">
			{#each featuredListings as listing}
				<Carousel.Item class="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3">
					<div class="h-128">
						<CarouselListingCard {...listing} />
					</div>
				</Carousel.Item>
			{/each}
			<Carousel.Item class="flex basis-auto items-center justify-center pl-2 md:pl-4">
				<a
					href="/listings"
					class="inline-flex rounded-lg border-2 border-dashed border-muted-foreground/25 px-8 py-4 text-muted-foreground transition-colors hover:border-muted-foreground/50"
				>
					See All Listings <ChevronLast strokeWidth={1} class="ml-2" />
				</a>
			</Carousel.Item>
		</Carousel.Content>
	</Carousel.Root>
</div>

<!-- Nearby Listings Carousel -->
<div class="w-full bg-muted/30 px-4">
	<Carousel.Root class="mx-auto max-w-screen-xl space-y-4 py-12">
		<div class="flex w-full items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold tracking-tight">More Properties</h2>
				<p class="text-sm text-muted-foreground">{nearbyListings.length} additional properties</p>
			</div>
			<div class="mx-3 inline-flex gap-6">
				<Carousel.Previous />
				<Carousel.Next />
			</div>
		</div>
		<Carousel.Content class="-ml-2 md:-ml-4">
			{#each nearbyListings as listing}
				<Carousel.Item class="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3">
					<div class="h-128">
						<CarouselListingCard {...listing} />
					</div>
				</Carousel.Item>
			{/each}
			{#if nearbyListings.length === 0}
				<Carousel.Item class="flex basis-auto items-center justify-center pl-2 md:pl-4">
					<div class="py-8 text-center text-muted-foreground">
						<p>No additional listings available</p>
					</div>
				</Carousel.Item>
			{/if}
			<Carousel.Item class="flex basis-auto items-center justify-center pl-2 md:pl-4">
				<a
					href="/listings"
					class="inline-flex rounded-lg border-2 border-dashed border-muted-foreground/25 px-8 py-4 text-muted-foreground transition-colors hover:border-muted-foreground/50"
				>
					See All Listings <ChevronLast strokeWidth={1} class="ml-2" />
				</a>
			</Carousel.Item>
		</Carousel.Content>
	</Carousel.Root>
</div>

<AskAi />

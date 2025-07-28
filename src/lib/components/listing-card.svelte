<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index";
	import { Separator } from "$lib/components/ui/separator/index";

	import * as Card from "$lib/components/ui/card/index";
	import type { ClientListing } from "$lib/types";

	let { agent, property, ...listing }: ClientListing = $props();

	// Loading state for image
	let imageLoaded = $state(false);

	const toTagType = (t: typeof property.type) => {
		return "For " + t.replace(/^\w/, (t) => t.toUpperCase());
	};

	let listingType = $derived(toTagType(property.type));

	let featuredPhoto = $derived.by(() => {
		const url = property.photosUrl.at(0)?.url;

		if (!url) {
			return "/no-image.jpg";
		}

		return url;
	});

	function getStatusDisplay(status: string) {
		switch (status) {
			case "sold":
				return "SOLD";
			case "pending":
				return "Pending";
			case "under-review":
				return "Under Review";
			case "submitted":
				return "Submitted";
			case "up":
			default:
				return "Available";
		}
	}
</script>

<a href="/listing/{listing.id}">
	<Card.Root
		class="relative w-sm gap-0 overflow-hidden py-0 {listing.status === 'sold' ? 'opacity-75' : ''}"
	>
		<Badge variant={property.type} class="absolute top-2 left-2 z-10">{listingType}</Badge>
		{#if listing.status === "sold"}
			<Badge variant="destructive" class="absolute top-2 right-2 z-10 font-bold text-white">
				SOLD
			</Badge>
		{/if}

		<div class="relative h-48 overflow-hidden bg-muted">
			<!-- Loading skeleton -->
			{#if !imageLoaded}
				<div class="absolute inset-0 animate-pulse bg-muted">
					<div
						class="animate-shimmer h-full w-full bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
					></div>
				</div>
			{/if}

			<img
				src={featuredPhoto}
				class="h-full w-full object-cover transition-opacity duration-300 {imageLoaded
					? 'opacity-100'
					: 'opacity-0'}"
				alt="listing"
				onload={() => (imageLoaded = true)}
				onerror={() => (imageLoaded = true)}
			/>
		</div>

		<Card.Content class="bg-background px-2 pb-2">
			<h2 class="text-xl font-bold tracking-tight">₱1,000</h2>
			<div class="flex h-5 items-center space-x-2 text-sm tracking-tight">
				<span class="font-semibold">{property.bedrooms} <span class="font-normal">bds</span></span>
				<Separator orientation="vertical" />
				<span class="font-semibold">{property.bathrooms} <span class="font-normal">ba</span></span>
				<Separator orientation="vertical" />
				<span class="font-semibold">{property.landArea} <span class="font-normal">sqm</span></span>
				<Separator orientation="vertical" />
				<span>{getStatusDisplay(listing.status)}</span>
			</div>

			<p class="text-sm">
				{Object.values(property.address)
					.slice(1)
					.filter((v) => v)
					.join(", ")}
			</p>
			<p class="text-xs text-muted-foreground">{agent.user.lastName}, {agent.user.firstName}</p>
		</Card.Content>
	</Card.Root>
</a>

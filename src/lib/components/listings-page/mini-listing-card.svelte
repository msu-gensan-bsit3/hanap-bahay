<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index";
	import * as Card from "$lib/components/ui/card/index";
	import type { ClientListing } from "$lib/types";
	import { formatPrice, getDetails, toTitleCase } from "$lib/utils";
	import { MapPin } from "@lucide/svelte";

	let { agent, property, ...listing }: ClientListing = $props();

	// Loading states for images
	let propertyImageLoaded = $state(false);

	let featuredPhoto = $derived.by(() => {
		const url = property.photosUrl.at(0)?.url;

		if (!url) {
			return "/no-image.jpg";
		}

		return url;
	});

	let details = $derived(getDetails(property));

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

<a href="/listings/{listing.id}" class="group block">
	<Card.Root
		class="relative flex flex-col gap-0 overflow-hidden p-0 shadow-sm transition-shadow hover:shadow-md max-h-[280px] {listing.status ===
		'sold'
			? 'opacity-75'
			: ''}"
	>
		<!-- Compact Image -->
		<div class="relative h-32 overflow-hidden bg-muted">
			<Badge variant={property.type} class="absolute top-2 left-2 z-10 text-xs">
				For {toTitleCase(property.type)}
			</Badge>
			{#if listing.status === "sold"}
				<Badge
					variant="destructive"
					class="absolute top-2 right-2 z-10 font-bold text-white text-xs"
				>
					SOLD
				</Badge>
			{/if}

			<!-- Loading skeleton for property image -->
			{#if !propertyImageLoaded}
				<div class="absolute inset-0 animate-pulse bg-muted">
					<div
						class="animate-shimmer h-full w-full bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
					></div>
				</div>
			{/if}

			<img
				src={featuredPhoto}
				class="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 {propertyImageLoaded
					? 'opacity-100'
					: 'opacity-0'}"
				alt={property.name}
				loading="lazy"
				onload={() => (propertyImageLoaded = true)}
				onerror={() => {
					featuredPhoto = "/no-image.jpg";
					propertyImageLoaded = true;
				}}
			/>
		</div>

		<!-- Compact Content -->
		<Card.Content class="p-3">
			<div class="space-y-2">
				<!-- Price -->
				<h3 class="text-lg font-bold tracking-tight">
					{formatPrice(property.price, false)}
				</h3>

				<!-- Property details -->
				<div class="text-xs text-muted-foreground">
					{details}
				</div>

				<!-- Address -->
				<div class="flex items-start gap-1">
					<MapPin class="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground" />
					<p class="line-clamp-1 text-xs text-muted-foreground">
						{Object.values(property.address)
							.slice(1)
							.filter((v) => v)
							.join(", ")}
					</p>
				</div>

				<!-- Property name -->
				<p class="line-clamp-1 text-sm font-medium">
					{property.name}
				</p>

				<!-- Agent info - minimal -->
				<div class="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
					<div class="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-muted">
						<img
							src={agent.user.profilePicture || "/no-profile.jpg"}
							alt="{agent.user.firstName} {agent.user.lastName}"
							class="h-full w-full object-cover"
						/>
					</div>
					<span class="truncate">
						{agent.user.firstName} {agent.user.lastName}
					</span>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</a>

<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index";
	import * as Card from "$lib/components/ui/card/index";
	import type { ClientListing } from "$lib/types";
	import { formatPrice, getDetails, toTitleCase } from "$lib/utils";
	import { Heart, MapPin } from "@lucide/svelte";

	let { agent, property, ...listing }: ClientListing = $props();

	// Loading states for images
	let propertyImageLoaded = $state(false);
	let agentImageLoaded = $state(false);

	let featuredPhoto = $derived.by(() => {
		const url = property.photosUrl.at(0)?.url;

		if (!url) {
			return "/no-image.jpg";
		}

		return url;
	});

	let details = $derived(getDetails(property));

	function getCategoryVariant(category: string) {
		const lowerCategory = category.toLowerCase();

		// House-related categories
		if (lowerCategory.includes("house") || lowerCategory.includes("townhouse")) {
			return "category-house";
		}

		// Condo-related categories
		if (lowerCategory.includes("condo") || lowerCategory.includes("apartment")) {
			return "category-condo";
		}

		// Lot/Land categories
		if (lowerCategory.includes("lot") || lowerCategory.includes("land")) {
			return "category-lot";
		}

		// Commercial categories
		if (
			lowerCategory.includes("commercial") ||
			lowerCategory.includes("office") ||
			lowerCategory.includes("building") ||
			lowerCategory.includes("retail")
		) {
			return "category-commercial";
		}

		// Default category variant
		return "category";
	}
</script>

<a href="/listings/{listing.id}" class="group block h-full">
	<Card.Root
		class="relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm transition-shadow hover:shadow-md"
	>
		<!-- Image with badge overlay -->
		<div class="relative h-full overflow-hidden bg-muted">
			<Badge variant={property.type} class="absolute top-3 left-3 z-10">
				For {toTitleCase(property.type)}
			</Badge>
			<button
				class="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1 transition-colors hover:bg-white"
			>
				<Heart class="h-4 w-4" />
			</button>

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

		<!-- Content -->
		<Card.Content class="flex flex-1 flex-col justify-between p-4">
			<div class="space-y-2">
				<!-- Price -->
				<h3 class="text-xl font-bold tracking-tight">
					{formatPrice(property.price, false)}
				</h3>

				<!-- Property details -->
				<div class="text-sm text-muted-foreground">
					{details}
				</div>

				<!-- Address -->
				<div class="flex items-start gap-1">
					<MapPin class="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground" />
					<p class="line-clamp-1 text-sm text-muted-foreground">
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

				<div class="flex justify-between gap-4">
					<!-- Features - show only first 2 -->
					{#if property.features.length > 0}
						<div class="no-scrollbar flex scroll-m-0 gap-1 overflow-scroll">
							{#each property.features as feature (feature.name)}
								<Badge variant="secondary" class="px-2 py-0.5 text-xs">
									{feature.name}
								</Badge>
							{/each}
							<!-- {#if property.features.length > 2}
								<Badge variant="outline" class="px-2 py-0.5 text-xs">
									+{property.features.length - 2} more
								</Badge>
							{/if} -->
						</div>
					{:else}
						<!-- <Badge variant="outline" class="px-2 py-0.5 text-xs">Listing</Badge> -->
						<p></p>
					{/if}

					<!-- Category -->
					<div class="flex items-center gap-2">
						<Badge
							variant={getCategoryVariant(property.category)}
							class="px-2 py-0.5 text-xs capitalize"
						>
							{property.category.replace(/-/g, " ")}
						</Badge>
					</div>
				</div>
			</div>

			<!-- Agent info -->
			<div class="mt-3 border-t pt-3">
				<div class="flex items-center gap-3">
					<div class="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted">
						<!-- Loading skeleton for agent image -->
						{#if !agentImageLoaded}
							<div class="absolute inset-0 animate-pulse bg-muted">
								<div
									class="animate-shimmer h-full w-full rounded-full bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
								></div>
							</div>
						{/if}

						<img
							src={agent.user.profilePicture || "/no-profile.jpg"}
							alt="{agent.user.firstName} {agent.user.lastName}"
							class="h-full w-full object-cover transition-opacity duration-300 {agentImageLoaded
								? 'opacity-100'
								: 'opacity-0'}"
							onload={() => (agentImageLoaded = true)}
							onerror={() => (agentImageLoaded = true)}
						/>
					</div>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-foreground">
							{agent.user.firstName}
							{agent.user.lastName}
						</p>
						{#if agent.credentials}
							<p class="truncate text-xs text-muted-foreground">
								{agent.credentials}
							</p>
						{:else}
							<p class="text-xs text-muted-foreground">Licensed Agent</p>
						{/if}
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</a>

<script lang="ts">
	import { formatPrice } from "$lib/utils";

	import { Badge } from "$lib/components/ui/badge/index";
	import { Separator } from "$lib/components/ui/separator/index";

	import * as Card from "$lib/components/ui/card/index";

	import { Heart, MapPin } from "@lucide/svelte";

	import type { ClientListing } from "$lib/types";

	let { agent, property, ...listing }: ClientListing = $props();

	let featuredPhoto = $derived.by(() => {
		const url = property.photosUrl.at(0)?.url;

		if (!url) {
			return "/no-image.jpg";
		}

		return url;
	});
</script>

<a href="/listings/{listing.id}" class="block h-full">
	<Card.Root
		class="relative flex h-full flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md p-0 gap-0"
	>
		<!-- Image with badge overlay -->
		<div class="relative overflow-hidden bg-muted h-full">
			<Badge variant={property.type} class="absolute top-3 left-3 z-10">
				For {property.type}
			</Badge>
			<button
				class="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1 transition-colors hover:bg-white"
			>
				<Heart class="h-4 w-4" />
			</button>
			<img 
				src={featuredPhoto} 
				class="h-full w-full object-cover" 
				alt={property.name}
				loading="lazy"
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
				<div class="flex items-center space-x-2 text-sm text-muted-foreground">
					<span class="font-medium">{property.bedrooms} bed</span>
					<Separator orientation="vertical" class="h-3" />
					<span class="font-medium">{property.bathrooms} bath</span>
					<Separator orientation="vertical" class="h-3" />
					<span class="font-medium">{property.landArea || "N/A"} sqm</span>
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

				<!-- Category -->
				<div class="flex items-center gap-2">
					<Badge variant="outline" class="px-2 py-0.5 text-xs capitalize">
						{property.category.replace(/-/g, ' ')}
					</Badge>
				</div>

				<!-- Features - show only first 2 -->
				{#if property.features.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each property.features.slice(0, 2) as feature (feature.name)}
							<Badge variant="secondary" class="px-2 py-0.5 text-xs">
								{feature.name}
							</Badge>
						{/each}
						{#if property.features.length > 2}
							<Badge variant="outline" class="px-2 py-0.5 text-xs">
								+{property.features.length - 2} more
							</Badge>
						{/if}
					</div>
          {:else}
          <Badge variant="outline" class="px-2 py-0.5 text-xs">
            Listing
          </Badge>
				{/if}
			</div>

			<!-- Agent info -->
			<div class="mt-3 border-t pt-3">
				<div class="flex items-center gap-3">
					<div class="h-8 w-8 overflow-hidden rounded-full bg-muted flex-shrink-0">
						<img 
							src={agent.user.profilePicture || "/no-profile.jpg"} 
							alt="{agent.user.firstName} {agent.user.lastName}"
							class="h-full w-full object-cover"
						/>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-foreground truncate">
							{agent.user.firstName} {agent.user.lastName}
						</p>
						{#if agent.credentials}
							<p class="text-xs text-muted-foreground truncate">
								{agent.credentials}
							</p>
						{:else}
							<p class="text-xs text-muted-foreground">
								Licensed Agent
							</p>
						{/if}
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</a>

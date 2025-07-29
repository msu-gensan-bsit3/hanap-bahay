<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index";
	import { Badge } from "$lib/components/ui/badge/index";
	import * as Card from "$lib/components/ui/card/index";
	import type { ClientListing } from "$lib/types";
	import { formatPrice, getDetails, toTitleCase } from "$lib/utils";
	import { Eye, Heart, MapPin } from "@lucide/svelte";

	let { agent, property, ...listing }: ClientListing = $props();

	// Loading states for images
	let propertyImageLoaded = $state(false);
	let imageError = $state(false);

	let featuredPhoto = $derived.by(() => {
		const url = property.photosUrl.at(0)?.url;

		if (!url || imageError) {
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

	function getPropertyTypeVariant(type: string) {
		return type as "sale" | "rent" | "lease";
	}

	function getStatusBadgeVariant(status: string) {
		switch (status) {
			case "sold":
				return "destructive";
			case "pending":
				return "secondary";
			case "under-review":
				return "outline";
			default:
				return "default";
		}
	}
</script>

<a
	href="/listings/{property.id}"
	class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	aria-label="View property {property.name} listed by {agent.user.firstName} {agent.user.lastName}"
>
	<Card.Root
		class="relative flex max-h-[360px] flex-col gap-0 overflow-hidden border border-border/50 bg-card/50 p-0 backdrop-blur-sm transition-all duration-300 ease-out focus-within:border-border focus-within:shadow-lg focus-within:shadow-black/5 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-black/5 {listing.status ===
		'sold'
			? 'opacity-80 grayscale-[0.3]'
			: ''}"
	>
		<!-- Enhanced Image Section -->
		<div class="relative h-28 overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
			<!-- Property Type Badge -->
			<Badge
				variant={getPropertyTypeVariant(property.type)}
				class="absolute top-2 left-2 z-20 text-xs font-semibold shadow-lg backdrop-blur-sm"
			>
				For {toTitleCase(property.type)}
			</Badge>

			<!-- Status Badge -->
			{#if listing.status === "sold"}
				<div class="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
					<Badge variant="destructive" class="px-3 py-1.5 text-sm font-bold text-white shadow-2xl">
						SOLD
					</Badge>
				</div>
			{:else if listing.status !== "up"}
				<Badge
					variant={getStatusBadgeVariant(listing.status)}
					class="absolute top-2 right-2 z-20 text-xs font-medium shadow-lg backdrop-blur-sm"
				>
					{getStatusDisplay(listing.status)}
				</Badge>
			{/if}

			<!-- Enhanced Loading skeleton -->
			{#if !propertyImageLoaded}
				<div class="absolute inset-0 bg-gradient-to-br from-muted via-muted/70 to-muted/50">
					<div
						class="h-full w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]"
					></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground"
						></div>
					</div>
				</div>
			{/if}

			<img
				src={featuredPhoto}
				class="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 {propertyImageLoaded
					? 'opacity-100'
					: 'opacity-0'}"
				alt="Property {property.name}"
				loading="lazy"
				onload={() => (propertyImageLoaded = true)}
				onerror={() => {
					imageError = true;
					propertyImageLoaded = true;
				}}
			/>

			<!-- Hover Overlay -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			></div>
		</div>

		<!-- Enhanced Content Section -->
		<Card.Content class="flex flex-1 flex-col p-3">
			<!-- Price - Most Important -->
			<div class="flex items-baseline justify-between">
				<h3 class="text-lg font-bold tracking-tight text-foreground">
					{formatPrice(property.price, false)}
				</h3>
				{#if listing.status === "up"}
					<div class="flex h-8 items-center gap-1 text-muted-foreground">
						<Eye class="h-3 w-3" />
						<span class="text-xs">Active</span>
					</div>
				{/if}
			</div>

			<!-- Property Details with Better Typography -->
			<div class="text-xs font-medium text-muted-foreground">
				{details}
			</div>

			<!-- Enhanced Address -->
			<div class="flex items-center gap-1.5">
				<MapPin class="mt-0.5 h-3 w-3 text-muted-foreground/80" />
				<p class="m-0 line-clamp-1 p-0 text-xs text-muted-foreground">
					{Object.values(property.address)
						.slice(1)
						.filter((v) => v)
						.join(", ")}
				</p>
			</div>

			<!-- Property Name -->
			<h4 class="line-clamp-1 flex-1 text-sm leading-tight font-medium text-foreground">
				{property.name}
			</h4>

			<!-- Enhanced Agent Info -->
			<div class="mt-2 flex items-center gap-3 border-border/50">
				<Avatar.Root class="h-6 w-6 shadow-sm ring-1 ring-background">
					<Avatar.Image
						src={agent.user.profilePicture || "/no-profile.jpg"}
						alt="{agent.user.firstName} {agent.user.lastName}"
					/>
					<Avatar.Fallback class="bg-muted text-xs font-medium">
						{agent.user.firstName.charAt(0)}{agent.user.lastName.charAt(0)}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex w-full items-center justify-between">
					<div class="max-h-10 min-w-0">
						<p class="m-0! text-xs font-medium text-foreground">
							{agent.user.firstName}
							{agent.user.lastName}
						</p>
						<p class="m-0! p-0 text-xs text-muted-foreground/80">Agent</p>
					</div>
					<div class="text-right">
						<Heart
							class="h-3 w-3 text-muted-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						/>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</a>

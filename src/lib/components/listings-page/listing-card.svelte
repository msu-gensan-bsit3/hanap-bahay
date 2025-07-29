<script lang="ts">
	import { formatPrice } from "$lib/utils";

	import PhotoCarousel from "$lib/components/listing/photo-carousels.svelte";

	import { Badge } from "$lib/components/ui/badge/index";
	import { Separator } from "$lib/components/ui/separator/index";

	import { Check, Heart, Mail } from "@lucide/svelte";

	import type { ClientListing } from "$lib/types";

	let { agent, property, ...listing }: ClientListing = $props();

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

<div
	class="flex h-64 min-w-fit overflow-hidden rounded-lg border-1 shadow-sm {listing.status ===
	'sold'
		? 'opacity-75'
		: ''}"
>
	<div class="relative h-full flex-4">
		{#if listing.status === "sold"}
			<div class="absolute top-2 left-2 z-10">
				<Badge variant="destructive" class="font-bold text-white">SOLD</Badge>
			</div>
		{/if}
		<PhotoCarousel photosUrl={property.photosUrl} />
	</div>
	<div class="flex h-full w-full flex-5 flex-col justify-between p-3">
		<div>
			<div class="inline-flex w-full justify-between pb-1">
				<h1 class="text-3xl font-semibold tracking-tight">
					{formatPrice(property.price, false)}
				</h1>
				<Heart />
			</div>

			<!-- Content -->
			<div class="space-y-2">
				<div>
					<div class="flex h-5 items-center space-x-2 text-sm tracking-tight">
						<span class="font-semibold"
							>{property.bedrooms} <span class="font-normal">bed(s)</span></span
						>
						<Separator orientation="vertical" />
						<span class="font-semibold"
							>{property.bathrooms} <span class="font-normal">bath(s)</span></span
						>
						<Separator orientation="vertical" />
						<span class="font-semibold">1,212 <span class="font-normal">sqm</span></span>
						<Separator orientation="vertical" />
						<span>{getStatusDisplay(listing.status)}</span>
					</div>
					<p class="text-sm text-muted-foreground">
						{Object.values(property.address)
							.slice(1)
							.filter((v) => v)
							.join(", ")}
					</p>
				</div>
				<p class="text-sm">
					{property.name}
				</p>
				<div class="flex gap-1">
					{#each property.features as feature (feature.name)}
						<div class="flex items-center justify-center gap-1 text-sm text-muted-foreground">
							<Check strokeWidth={1} />
							{feature.name}
						</div>
					{/each}
				</div>
				<div class="flex gap-1">
					<Badge variant={property.type} class="px-4">For {property.type}</Badge>
				</div>
			</div>
		</div>
		<!-- Header -->

		<!-- Footer -->
		<div class="inline-flex w-full items-center justify-between">
			<p class="text-md font-semibold">{agent.user.lastName}, {agent.user.firstName}</p>
			<Mail />
		</div>
	</div>
</div>

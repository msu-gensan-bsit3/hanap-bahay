<script lang="ts">
	import { formatPrice } from "$lib/utils"

	import PhotoCarousel from "$lib/components/listing/photo-carousels.svelte"

	import { Badge } from "$lib/components/ui/badge/index"
	import { Separator } from "$lib/components/ui/separator/index"

	import * as Card from "$lib/components/ui/card/index"

	import { Check, Mail, Heart } from "@lucide/svelte"

	import type { ClientListing, Listing } from "$lib/types";

	let { agent, property, ...listing }: ClientListing = $props()

</script>

<div class="min-w-fit h-64 border-1 shadow-sm rounded-lg overflow-hidden flex">
	<div class="h-full flex-4">
		<PhotoCarousel photosUrl={property.photosUrl} />
	</div>
	<div class="w-full h-full flex flex-5 flex-col justify-between p-3">
		<div>
			<div class="w-full inline-flex justify-between pb-1">
				<h1 class="text-3xl font-semibold tracking-tight">
					{ formatPrice(property.price, false) }
				</h1>
				<Heart />
			</div>

			<!-- Content -->
			<div class="space-y-2">
				<div>
					<div class="h-5 flex items-center space-x-2 text-sm tracking-tight">
						<span class="font-semibold">{ property.bedrooms } <span class="font-normal">bed(s)</span></span>
						<Separator orientation="vertical" />
						<span class="font-semibold">{ property.bathrooms } <span class="font-normal">bath(s)</span></span>
						<Separator orientation="vertical" />
						<span class="font-semibold">1,212 <span class="font-normal">sqm</span></span>
						<Separator orientation="vertical" />
						<span>Active</span>
					</div>
					<p class="text-sm text-muted-foreground">
						{ Object.values(property.address).slice(1).filter(v => v).join(', ')}
					</p>
				</div>
				<p class="text-sm">
					{ property.name }
				</p>
				<div class="flex gap-1">
					{#each property.features as feature (feature.name)}
						<div class="flex gap-1 items-center justify-center text-sm text-muted-foreground">
							<Check strokeWidth={1} />
							{feature.name}
						</div>
					{/each}
				</div>
				<div class="flex gap-1">
					<Badge variant={property.type} class="px-4">For { property.type }</Badge>
				</div>
			</div>
		</div>
		<!-- Header -->

		<!-- Footer -->
		<div class="w-full inline-flex items-center justify-between">
			<p class="text-md font-semibold">{agent.user.lastName}, {agent.user.firstName}</p>
			<Mail />
		</div>
	</div>
</div>
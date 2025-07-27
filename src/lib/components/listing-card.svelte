<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index"
	import { Separator } from "$lib/components/ui/separator/index"
	import noImage from '../../assets/no-image.jpg'

	import * as Card from "$lib/components/ui/card/index"
	import type { ClientListing, Listing } from "$lib/types";

	let { agent, property, ...listing }: ClientListing = $props()

	const toTagType = (t:typeof property.type) => {
		return "For " + t.replace(/^\w/, t => t.toUpperCase())
	}

	let listingType = $derived(toTagType(property.type))

	let featuredPhoto = $derived.by(()=> {
		const url = property.photosUrl.at(0)?.url

		if (!url) {
			return noImage
		}
		
		return url
	})

</script>

<Card.Root class="w-sm relative overflow-hidden gap-0 py-0">

	<Badge variant={property.type} class="absolute top-2 left-2">{listingType}</Badge>
	<img src={featuredPhoto} class="w-full h-48 object-cover" alt="listing">

	<Card.Content class="bg-background px-2 pb-2">

		<h2 class="text-xl font-bold tracking-tight">{ property.price }</h2>
		<div class="h-5 flex items-center space-x-2 text-sm tracking-tight">
			<span class="font-semibold">{ property.bedrooms } <span class="font-normal">bds</span></span>
			<Separator orientation="vertical" />
			<span class="font-semibold">{ property.bathrooms } <span class="font-normal">ba</span></span>
			<Separator orientation="vertical" />
			<span class="font-semibold">{ property.landArea } <span class="font-normal">sqft</span></span>
			<Separator orientation="vertical" />
			<span>Active</span>
		</div>

		<p class="text-sm">{ Object.values(property.address).slice(1).filter(v => v).join(', ')}</p>
		<p class="text-xs text-muted-foreground">{ agent.user.lastName }, { agent.user.firstName }</p>

	</Card.Content>
</Card.Root>
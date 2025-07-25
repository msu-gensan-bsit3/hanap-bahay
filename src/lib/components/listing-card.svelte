<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index"
	import { Separator } from "$lib/components/ui/separator/index"

	import * as Card from "$lib/components/ui/card/index"

	// sample palang ni na mga types i change lang
	type TagType = "For Sale" | "For Rent" | "For Lease"
	type TagColor = "red" |"green" | "blue"

	interface ListingProps {
		tagType: TagType
		tagColor: TagColor

		thumbnailLink: string
		bedrooms: number
		bathrooms: number
		size: number

		address: string
		agent: string
	}

	let { tagType, tagColor, thumbnailLink, bedrooms, bathrooms, size, address, agent }: ListingProps = $props()
</script>

<Card.Root class="w-sm relative overflow-hidden gap-0 py-0">

	<Badge variant={tagType} class="absolute top-2 left-2">{tagType}</Badge>
	<img src={thumbnailLink} class="w-full h-48 object-cover">

	<Card.Content class="bg-background px-2 pb-2">

		<h2 class="text-xl font-bold tracking-tight">₱1,000</h2>
		<div class="h-5 flex items-center space-x-2 text-sm tracking-tight">
			<span class="font-semibold">{ bedrooms }<span class="font-normal">{" bds"}</span></span>
			<Separator orientation="vertical" />
			<span class="font-semibold">{ bathrooms }<span class="font-normal">{" ba"}</span></span>
			<Separator orientation="vertical" />
			<span class="font-semibold">{ size }<span class="font-normal">{" sqft"}</span></span>
			<Separator orientation="vertical" />
			<span>Active</span>
		</div>

		<p class="text-sm">{address}</p>
		<p class="text-xs text-muted-foreground">{agent}</p>

	</Card.Content>
</Card.Root>
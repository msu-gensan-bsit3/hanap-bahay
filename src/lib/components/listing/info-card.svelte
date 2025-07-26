<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { toTitleCase } from "$lib/utils";

	export let type: string;
	export let category: string;
	export let landArea: number | null | undefined;
	export let floorArea: number | null | undefined;

	function formatArea(area: number) {
		return `${area} sqm`;
	}
</script>

<Card class="property-card">
	<CardHeader>
		<CardTitle>Property Information</CardTitle>
	</CardHeader>
	<CardContent class="space-y-3">
		<div class="grid grid-cols-2 gap-4 text-sm">
			<div>
				<span class="text-gray-500">Type:</span>
				<p class="font-medium capitalize">{type}</p>
			</div>
			<div>
				<span class="text-gray-500">Category:</span>
				<p class="font-medium">{toTitleCase(category)}</p>
			</div>
			{#if landArea}
				<div>
					<span class="text-gray-500">Land Area:</span>
					<p class="font-medium">{formatArea(landArea)}</p>
				</div>
			{/if}
			{#if floorArea}
				<div>
					<span class="text-gray-500">Floor Area:</span>
					<p class="font-medium">{formatArea(floorArea)}</p>
				</div>
			{/if}
		</div>
	</CardContent>
</Card>
<style>
	/* Smooth transitions for cards */
	:global(.property-card) {
		transition: box-shadow 0.2s ease-in-out;
	}

	:global(.property-card:hover) {
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>

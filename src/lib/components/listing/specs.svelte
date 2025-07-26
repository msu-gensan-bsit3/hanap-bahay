<script lang="ts">
	import { Bed, Bath, Car, Home, type IconProps, LandPlot } from "@lucide/svelte";
	import type { Component } from "svelte";

	interface props {
		bedrooms?: number;
		bathrooms?: number;
		floorArea?: number;
		carSpace?: number;
		landArea: number;
	}
	let { bedrooms, bathrooms, floorArea, carSpace, landArea }: props = $props();

	function formatArea(area: number) {
		return `${area} sqm`;
	}
</script>

<div class="mb-8 flex gap-6 text-gray-600 flex-wrap">
	{#snippet spec(name: string, Icon: Component<IconProps>)}
		<div class="flex items-center gap-2">
			<Icon class="property-spec-icon h-5 w-5" />
			<span>{name}</span>
		</div>
	{/snippet}

	{#if bedrooms}
		{@render spec(`${bedrooms} Bedrooms`, Bed)}
	{/if}
	{#if bathrooms}
		{@render spec(`${bathrooms} Bathrooms`, Bath)}
	{/if}
	{#if carSpace}
		{@render spec(`${carSpace} Garage`, Car)}
	{/if}
	{#if floorArea}
		{@render spec(formatArea(floorArea), Home)}
	{/if}
	{#if landArea}
		{@render spec(formatArea(landArea), LandPlot)}
	{/if}
</div>

<style>
	/* Custom styling for property specs icons */
	:global(.property-spec-icon) {
		color: #6b7280;
	}
</style>

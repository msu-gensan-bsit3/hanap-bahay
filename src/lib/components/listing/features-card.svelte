<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import {
		AirVent,
		Wifi,
		TreePine,
		Shield,
		Home,
		Shirt,
		type IconProps,
	} from "@lucide/svelte";
	import type { Component } from "svelte";

	export let features: { name: string }[];

	const featureIcons: Record<string, Component<IconProps>> = {
		"Air Conditioning": AirVent,
		"Built-in Closets": Home,
		Garden: TreePine,
		"Laundry Area": Shirt,
		"24/7 Security": Shield,
		"Fiber Internet Ready": Wifi,
	};

	function getFeatureIcon(featureName: string) {
		return featureIcons[featureName] || Home;
	}
</script>

{#if features && features.length > 0}
	<Card class="property-card">
		<CardHeader>
			<CardTitle>Features & Amenities</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-2 gap-3">
				{#each features as feature}
					{@const FeatureIcon = getFeatureIcon(feature.name)}
					<div class="flex items-center gap-3 text-gray-700">
						<div class="feature-icon text-green-600">
							<FeatureIcon class="h-5 w-5" />
						</div>
						<span>{feature.name}</span>
					</div>
				{/each}
			</div>
		</CardContent>
	</Card>
{/if}
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

	/* Feature icon styling */
	:global(.feature-icon) {
		flex-shrink: 0;
	}
</style>

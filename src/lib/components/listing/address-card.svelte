<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { MapPin } from "@lucide/svelte";

	interface props {
		fullAddress: string;
		propertyName: string;
		location?: { longitude: number; latitude: number };
	}

	let { fullAddress, propertyName, location }: props = $props();

	const mapSrc =
		location && location.latitude && location.longitude
			? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
			: `https://maps.google.com/maps?q=${encodeURIComponent(
					fullAddress,
				)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
</script>

<Card class="property-card">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<MapPin class="h-5 w-5" />
			Address
		</CardTitle>
	</CardHeader>
	<CardContent>
		<p class="mb-4 text-gray-700">
			{fullAddress}
		</p>
		<div class="aspect-video overflow-hidden rounded-lg">
			<iframe
				src={mapSrc}
				title={propertyName}
				width="100%"
				height="100%"
				style="border:0;"
				allowfullscreen={true}
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
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

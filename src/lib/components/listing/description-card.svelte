<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

	let { description }: { description?: string } = $props();
</script>

{#if description}
	<Card class="property-card">
		<CardHeader>
			<CardTitle>Description</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="leading-relaxed text-gray-700">
				{@html description.replace(/\n/g, "<br>")}
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
</style>

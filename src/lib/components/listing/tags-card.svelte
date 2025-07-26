<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";

	export let tags: { name: string }[];
</script>

{#if tags && tags.length > 0}
	<Card class="property-card">
		<CardHeader>
			<CardTitle>Tags</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="flex flex-wrap gap-2">
				{#each tags as tag}
					<Badge variant="secondary">{tag.name}</Badge>
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
</style>

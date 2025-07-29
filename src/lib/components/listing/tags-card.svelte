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

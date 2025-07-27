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

<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";
	import { MapPin } from "@lucide/svelte";

	const locations = [
		"All Locations",
		"Metro Manila",
		"Cebu",
		"Davao",
		"Iloilo",
		"Baguio",
		"Cagayan de Oro",
		"Bacolod",
		"Zamboanga",
	] as const;

	let { location = $bindable() }: { location: string } = $props();
</script>

<Select.Root type="single" bind:value={location}>
	<Select.Trigger class="h-10 w-full min-w-40 gap-2">
		<MapPin class="h-4 w-4 flex-shrink-0" />
		<span class="truncate">{location}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each locations as loc (loc)}
				<Select.Item value={loc}>
					{loc}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

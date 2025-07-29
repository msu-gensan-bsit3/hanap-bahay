<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";

	const sorts = [
		"Default",
		"Highest Price",
		"Lowest Price",
		"Newest First",
		"Oldest First",
	] as const;

	let { sortBy = $bindable() }: { sortBy: string } = $props();
</script>

<Select.Root type="single" bind:value={sortBy}>
	<Select.Trigger
		class="max-h-fit border-none p-0 text-sm tracking-tight text-muted-foreground shadow-none"
	>
		Sort by<span class="font-bold underline">{sortBy}</span>
	</Select.Trigger>
	<Select.Content align="center">
		<Select.Group>
			{#each sorts as sort (sort)}
				<Select.Item value={sort} class="tracking-tight">
					{sort}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

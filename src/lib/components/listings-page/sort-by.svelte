<script lang="ts">
	import * as Select from "$lib/components/ui/select/index"

	const sorts = [
		"Highest Price",
		"Lowest Price"
	]

	let { sortBy = $bindable() } = $props()
</script>

<Select.Root type="single" bind:value={sortBy}>
	<Select.Trigger class="max-h-fit border-none shadow-none p-0 text-sm text-muted-foreground tracking-tight">
		Sort by<span class="font-bold underline">{ sortBy }</span>
	</Select.Trigger>
	<Select.Content align="center">
		<Select.Group>
			{#each sorts as sort (sort)}
				<Select.Item
					value={sort}
					class="tracking-tight"
				>
					{sort}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
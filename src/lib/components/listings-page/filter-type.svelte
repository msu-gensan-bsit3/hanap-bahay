<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";

	const saleTypes = ["All Types", "For Sale", "For Rent", "For Lease"] as const;

	let { saleType = $bindable() }: { saleType: string } = $props();
</script>

<Select.Root type="single" bind:value={saleType}>
	<Select.Trigger class="h-10 w-full min-w-30">
		<span class="truncate">{saleType}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each saleTypes as type (type)}
				<Select.Item value={type}>
					{type}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

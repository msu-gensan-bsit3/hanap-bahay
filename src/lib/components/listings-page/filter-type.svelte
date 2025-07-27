<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import * as RadioGroup from "$lib/components/ui/radio-group/index";
	import { ChevronDown, ChevronUp } from "@lucide/svelte";

	let isOpen = $state(false);
	let tempType = $state("All Types");

	let { saleType = $bindable() } = $props();

	const applyChanges = () => {
		isOpen = false;
		saleType = tempType;
	};

	// Update tempType when saleType changes externally (like reset)
	$effect(() => {
		tempType = saleType;
	});
</script>

<DropdownMenu.Root bind:open={isOpen}>
	<DropdownMenu.Trigger class="flex-1">
		<Button variant={saleType !== "All Types" ? "default" : "outline"} class="w-full">
			{saleType}
			{#if isOpen}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start" class="w-40">
		<RadioGroup.Root bind:value={tempType}>
			{#each ["All Types", "For Sale", "For Rent", "For Lease"] as type}
				<label
					class="flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-muted/50"
				>
					<RadioGroup.Item value={type} />
					<span class="text-sm">{type}</span>
				</label>
			{/each}
		</RadioGroup.Root>
		<div class="mt-3 p-2 pt-0">
			<Button onclick={applyChanges} class="w-full" size="sm">Apply</Button>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

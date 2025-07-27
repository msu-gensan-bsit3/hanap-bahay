<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import * as RadioGroup from "$lib/components/ui/radio-group/index";

	import { Button } from "$lib/components/ui/button/index";
	import { Label } from "$lib/components/ui/label/index";

	import { ChevronDown, ChevronUp } from "@lucide/svelte";

	let isOpen = $state(false);
	let tempCategory = $state("all");

	let { category = $bindable() }: { category: string } = $props();

	const categories = [
		{ value: "all", label: "All Categories" },
		{ value: "house-and-lot", label: "House and Lot" },
		{ value: "apartment", label: "Apartment" },
		{ value: "boarding-house", label: "Boarding House" },
		{ value: "townhouse", label: "Townhouse" },
		{ value: "condominium", label: "Condominium" },
		{ value: "building", label: "Building" },
		{ value: "office", label: "Office" },
		{ value: "commercial-lot", label: "Commercial Lot" },
		{ value: "residential-lot", label: "Residential Lot" },
		{ value: "industrial-lot", label: "Industrial Lot" },
	];

	const applyChanges = () => {
		isOpen = false;
		category = tempCategory;
	};

	// Update tempCategory when category changes externally (like reset)
	$effect(() => {
		tempCategory = category;
	});
</script>

<DropdownMenu.Root bind:open={isOpen}>
	<DropdownMenu.Trigger class="flex-1">
		<Button variant="outline" class="w-full">
			{categories.find((c) => c.value === category)?.label || "Category"}
			{#if isOpen}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start" class="w-56">
		<RadioGroup.Root bind:value={tempCategory}>
			{#each categories as cat}
				<label
					class="flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-muted/50"
				>
					<RadioGroup.Item value={cat.value} />
					<span class="text-sm">{cat.label}</span>
				</label>
			{/each}
		</RadioGroup.Root>
		<div class="p-2 pt-0 mt-3">
			<Button onclick={applyChanges} class="w-full" size="sm">Apply</Button>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

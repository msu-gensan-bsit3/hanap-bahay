<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";
	import { cn } from "$lib/utils";

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

	let { category = $bindable() }: { category: string } = $props();

	const isActive = $derived(category !== "all");
</script>

<Select.Root type="single" bind:value={category}>
	<Select.Trigger
		class={cn("h-10 w-full min-w-37", isActive && "border-secondary bg-secondary/80")}
	>
		<span class="truncate">{categories.find((c) => c.value === category)?.label || "Category"}</span
		>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each categories as cat (cat.value)}
				<Select.Item value={cat.value}>
					{cat.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

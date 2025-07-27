<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import * as RadioGroup from "$lib/components/ui/radio-group/index";

	import { Button } from "$lib/components/ui/button/index";
	import { Label } from "$lib/components/ui/label/index";

	import { ChevronDown, ChevronUp } from "@lucide/svelte";

	let isOpen = $state(false);
	let tempType = $state("For Sale");

	let { saleType = $bindable() }: { saleType: string } = $props();

	const applyChanges = () => {
		isOpen = false;
		saleType = tempType;
	};
</script>

<DropdownMenu.Root bind:open={isOpen}>
	<DropdownMenu.Trigger class="flex-1">
		<Button variant="outline" class="w-full">
			Category
			{#if isOpen}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start">
		<RadioGroup.Root value={tempType}>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="sale" />
				<Label>For Sale</Label>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="rent" />
				<Label>For Rent</Label>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="lease" />
				<Label>For Lease</Label>
			</div>
		</RadioGroup.Root>
		<Button onclick={applyChanges} class="w-full">Apply</Button>
	</DropdownMenu.Content>
</DropdownMenu.Root>

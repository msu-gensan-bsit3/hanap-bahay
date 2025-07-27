<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
	import * as RadioGroup from "$lib/components/ui/radio-group/index"

	import { Button } from "$lib/components/ui/button/index"
	import { Label } from "$lib/components/ui/label/index"

	import { ChevronDown, ChevronUp } from "@lucide/svelte"

	let isOpen = $state(false)
	let tempType = $state("All Types")

	let { saleType = $bindable() } = $props()

	const applyChanges = () => {
		isOpen = false
		saleType = tempType
	}

	// Update tempType when saleType changes externally (like reset)
	$effect(() => {
		tempType = saleType
	})
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
			<label
				class="flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-muted/50"
			>
				<RadioGroup.Item value="All Types" />
				<span class="text-sm">All Types</span>
			</label>
			<label
				class="flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-muted/50"
			>
				<RadioGroup.Item value="For sale" />
				<span class="text-sm">For Sale</span>
			</label>
			<label
				class="flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-muted/50"
			>
				<RadioGroup.Item value="For rent" />
				<span class="text-sm">For Rent</span>
			</label>
			<label
				class="flex cursor-pointer items-center gap-2 rounded-sm p-2 transition-colors hover:bg-muted/50"
			>
				<RadioGroup.Item value="For lease" />
				<span class="text-sm">For Lease</span>
			</label>
		</RadioGroup.Root>
		<div class="p-2 pt-0 mt-3">
			<Button onclick={applyChanges} class="w-full" size="sm">Apply</Button>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
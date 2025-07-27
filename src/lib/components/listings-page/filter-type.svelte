<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
	import * as RadioGroup from "$lib/components/ui/radio-group/index"

	import { Button } from "$lib/components/ui/button/index"
	import { Label } from "$lib/components/ui/label/index"

	import { ChevronDown, ChevronUp } from "@lucide/svelte"

	let isOpen = $state(false)
	let tempType = $state("For Sale")

	let { saleType = $bindable() } = $props()

	const applyChanges = () => {
		isOpen = false
		saleType = tempType
	}
</script>

<DropdownMenu.Root bind:open={isOpen}>
	<DropdownMenu.Trigger class="flex-1">
		<Button variant="outline" class="w-full">
			{saleType}
			{#if isOpen}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start" class="min-w-xs p-2 space-y-2">
		<RadioGroup.Root bind:value={tempType}>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="For sale" />
				<Label>For Sale</Label>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="For rent" />
				<Label>For Rent</Label>
			</div>
			<div class="flex items-center gap-2">
				<RadioGroup.Item value="For lease" />
				<Label>For Lease</Label>
			</div>
		</RadioGroup.Root>
		<Button
			onclick={applyChanges}
			class="w-full"
		>
			Apply
		</Button>
	</DropdownMenu.Content>
</DropdownMenu.Root>
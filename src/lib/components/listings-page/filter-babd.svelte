<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index"

	import { Button } from "$lib/components/ui/button/index"
	import { Checkbox } from "$lib/components/ui/checkbox/index"
	import { Label } from "$lib/components/ui/label/index"

	import { ChevronDown, ChevronUp } from "@lucide/svelte"

	// parent variables
	let isOpen = $state(false)
	let count: string[] = []
	for (let i = 1; i <= 5; i += 1) {
		count.push(i.toString())
	}

	let tempBeds = $state("")
	let tempBaths = $state("")

	// child variables
	let { bedrooms = $bindable(), exactBeds = $bindable(), bathrooms = $bindable() } = $props()
	const triggerContent = $derived.by(() => {
		if (bedrooms === 0 && bathrooms === 0) {
			return "Beds & Baths"
		}
		if (exactBeds) {
			return `${bedrooms === 0 ? 'Studio' : bedrooms + ' bd'}, ${bathrooms}+ ba`
		}
		return `${bedrooms}+ bd, ${bathrooms}+ ba`
	})

	const applyChanges = () => {
		isOpen = false
		bedrooms = tempBeds === "" ? 0 : parseInt(tempBeds)
		bathrooms = tempBaths === "" ? 0 : parseInt(tempBaths)
	}
</script>

<DropdownMenu.Root bind:open={isOpen}>
	<DropdownMenu.Trigger class="flex-1">
		<Button class="w-full">
			{triggerContent}
			{#if isOpen}
				<ChevronUp />
			{:else}
				<ChevronDown />
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start" class="min-w-xs p-2">
		<div class="space-y-4">
			<!-- Bedrooms -->
			<DropdownMenu.Label class="bg-muted rounded-sm">Number of Bedrooms</DropdownMenu.Label>
			<DropdownMenu.Group class="space-y-2">
				<Label>Bedrooms</Label>
				<ToggleGroup.Root
					variant="outline"
					type="single"
					class="w-full"
					bind:value={tempBeds}
				>
					{#each count as value ("beds" + value)}
						<ToggleGroup.Item
							value={value}
						>
							{value}
							{#if !exactBeds}
								+
							{/if}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
				<div class="flex items-center gap-2">
					<Checkbox bind:checked={exactBeds} />
					<Label>Use exact match</Label>
				</div>
			</DropdownMenu.Group>
			<!-- Bathrooms -->
			<DropdownMenu.Label class="bg-muted rounded-sm">Number of Bathrooms</DropdownMenu.Label>
			<DropdownMenu.Group>
				<Label>Bathrooms</Label>
				<ToggleGroup.Root
					variant="outline"
					type="single"
					class="w-full"
					bind:value={tempBaths}
				>
					{#each count as value ('baths' + value)}
						<ToggleGroup.Item
							value={value}
						>
							{value}+
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</DropdownMenu.Group>
			<!-- Apply Button -->
			<Button
				onclick={applyChanges}
				class="w-full"
			>
				Apply
			</Button>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>
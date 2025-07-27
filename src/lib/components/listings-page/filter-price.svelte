<script lang="ts">
	import { formatPrice } from "$lib/utils"

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index"
	import * as Select from "$lib/components/ui/select/index"

	import { Button } from "$lib/components/ui/button/index"

	import { ChevronDown, ChevronUp } from "@lucide/svelte"

	// parent variables
	let isOpen = $state(false)

	let tempMin = $state(0)
	let tempMax = $state(0)

	const minRange = $derived.by(() => {
		let prices = []
		if (tempMax === 0) {
			for (let i = 0; i <= 100000000; i += 10000000) {
				prices.push(i)
			}
		} else {
			for (let i = 0; i < tempMax; i += 10000000) {
				prices.push(i)
			}
		}
		return prices
	})
	const maxRange = $derived.by(() => {
		let prices = []
		for (let i = tempMin; i <= 100000000; i += 10000000) {
			prices.push(i)
		}
		return prices
	})

	// child variables
	let { minPrice = $bindable(), maxPrice = $bindable() } = $props()
	const triggerContent = $derived.by(() => {
		if (minPrice === maxPrice) {
			return "Price Range"
		}
		if (minPrice > maxPrice) {
			return `${formatPrice(minPrice)}+`
		}
		if (maxPrice - minPrice === maxPrice) {
			return `Up to ${formatPrice(maxPrice)}`
		}
		return formatPrice(minPrice) + " - "  + formatPrice(maxPrice)
	})
	const triggerMin = $derived.by(() =>{
		if (tempMin === 0) {
			return "No min"
		}
		return formatPrice(tempMin)
	})
	const triggerMax = $derived.by(() =>{
		if (tempMax === 0) {
			return "No max"
		}
		return formatPrice(tempMax)
	})


	const applyChanges = () => {
		isOpen = false
		minPrice = tempMin
		maxPrice = tempMax
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
	<DropdownMenu.Content align="start">
		<DropdownMenu.Label class="bg-muted rounded-sm">Price Range</DropdownMenu.Label>
		<div class="m-1 space-y-4">
			<div class="w-full inline-flex items-center justify-between">
				<DropdownMenu.Group>
					<!-- Minimum -->
					<DropdownMenu.Label>Minimum</DropdownMenu.Label>
					<Select.Root type="single" bind:value={tempMin}>
						<Select.Trigger class="w-full">
							{triggerMin}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each minRange as price ("min" + price)}
									<Select.Item
										value={price}
										label={price}
									>
										{formatPrice(price)}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</DropdownMenu.Group>
				<span>_</span>
				<DropdownMenu.Group>
					<!-- Maximum -->
					<DropdownMenu.Label>Maximum</DropdownMenu.Label>
					<Select.Root type="single" bind:value={tempMax}>
						<Select.Trigger class="w-full">
							{triggerMax}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each maxRange as price ("max" + price)}
									<Select.Item
										value={price}
										label={price}
									>
										{formatPrice(price)}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</DropdownMenu.Group>
			</div>
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
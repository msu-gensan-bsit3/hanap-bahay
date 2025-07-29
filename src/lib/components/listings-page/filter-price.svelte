<script lang="ts">
	import { formatPrice } from "$lib/utils";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import * as Select from "$lib/components/ui/select/index";

	import { Button } from "$lib/components/ui/button/index";

	import { ChevronDown, ChevronUp } from "@lucide/svelte";

	// parent variables
	let isOpen = $state(false);

	let tempMin = $state(0);
	let tempMax = $state(0);

	const minRange = $derived.by(() => {
		let prices = [];
		if (tempMax === 0) {
			for (let i = 0; i <= 100000000; i += 10000000) {
				prices.push(i);
			}
		} else {
			for (let i = 0; i < tempMax; i += 10000000) {
				prices.push(i);
			}
		}
		return prices;
	});
	const maxRange = $derived.by(() => {
		let prices = [];
		for (let i = tempMin; i <= 100000000; i += 10000000) {
			prices.push(i);
		}
		return prices;
	});

	// child variables
	let { minPrice = $bindable(), maxPrice = $bindable() } = $props();
	const triggerContent = $derived.by(() => {
		if (minPrice === maxPrice) {
			return "Price Range";
		}
		if (minPrice > maxPrice) {
			return `${formatPrice(minPrice)}+`;
		}
		if (maxPrice - minPrice === maxPrice) {
			return `Up to ${formatPrice(maxPrice)}`;
		}
		return formatPrice(minPrice) + " - " + formatPrice(maxPrice);
	});
	const triggerMin = $derived.by(() => {
		if (tempMin === 0) {
			return "No min";
		}
		return formatPrice(tempMin);
	});
	const triggerMax = $derived.by(() => {
		if (tempMax === 0) {
			return "No max";
		}
		return formatPrice(tempMax);
	});

	const applyChanges = () => {
		isOpen = false;
		minPrice = tempMin;
		maxPrice = tempMax;
	};

	// Update temp values when props change externally (like reset)
	$effect(() => {
		tempMin = minPrice;
		tempMax = maxPrice;
	});
</script>

<DropdownMenu.Root bind:open={isOpen}>
	<DropdownMenu.Trigger
		class="flex h-10 w-full min-w-35 flex-1 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 {minPrice >
			0 || maxPrice > 0
			? 'border-secondary bg-secondary/80'
			: ''}"
	>
		{triggerContent}
		{#if isOpen}
			<ChevronUp size={16} />
		{:else}
			<ChevronDown size={16} />
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start" class="w-80">
		<div class="space-y-4 p-4">
			<div class="text-center text-sm font-medium">Price Range</div>

			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<label for="min-price" class="text-xs font-medium text-muted-foreground">Minimum</label>
					<Select.Root
						type="single"
						value={tempMin.toString()}
						onValueChange={(value) => (tempMin = parseInt(value || "0"))}
					>
						<Select.Trigger id="min-price" class="w-full">
							{triggerMin}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each minRange as price ("min" + price)}
									<Select.Item value={price.toString()}>
										{price === 0 ? "No minimum" : formatPrice(price)}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<div class="space-y-2">
					<label for="max-price" class="text-xs font-medium text-muted-foreground">Maximum</label>
					<Select.Root
						type="single"
						value={tempMax.toString()}
						onValueChange={(value) => (tempMax = parseInt(value || "0"))}
					>
						<Select.Trigger id="max-price" class="w-full">
							{triggerMax}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each maxRange as price ("max" + price)}
									<Select.Item value={price.toString()}>
										{price === 0 ? "No maximum" : formatPrice(price)}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<div class="pt-2">
				<Button onclick={applyChanges} class="w-full" size="sm">Apply</Button>
			</div>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index";

	import { Button } from "$lib/components/ui/button/index";
	import { Checkbox } from "$lib/components/ui/checkbox/index";
	import { Label } from "$lib/components/ui/label/index";

	import { Bath, Bed, BedSingle, ChevronDown, ChevronUp } from "@lucide/svelte";

	// parent variables
	let isOpen = $state(false);
	let count: string[] = [];
	for (let i = 1; i <= 5; i += 1) {
		count.push(i.toString());
	}

	let tempBeds = $state("");
	let tempBaths = $state("");

	interface props {
		bedrooms: number;
		bathrooms: number;
		exactBeds: boolean;
		exactBaths: boolean;
	}

	// child variables
	let {
		bedrooms = $bindable(),
		exactBeds = $bindable(),
		bathrooms = $bindable(),
		exactBaths = $bindable(),
	}: props = $props();

	const triggerContent = $derived.by(() => {
		if (bedrooms === 0 && bathrooms === 0) {
			return "Beds & Baths";
		}

		const bedroomText =
			bedrooms === 0 ? "Studio" : `${bedrooms}${exactBeds ? "" : "+"} ${bedrooms === 1 ? "bed" : "beds"}`;
		const bathroomText = `${bathrooms}${exactBaths ? "" : "+"} ${bathrooms === 1 ? "bath" : "baths"}`;

		return `${bedroomText}, ${bathroomText}`;
	});

	const applyChanges = () => {
		isOpen = false;
		bedrooms = tempBeds === "" ? 0 : parseInt(tempBeds);
		bathrooms = tempBaths === "" ? 0 : parseInt(tempBaths);
	};
</script>

<DropdownMenu.Root bind:open={isOpen}>
	<DropdownMenu.Trigger class="flex-1">
		<Button
			variant={bedrooms > 0 || bathrooms > 0 ? "default" : "outline"}
			class="h-10 w-full justify-between border-input text-sm font-medium transition-colors hover:bg-muted/50"
		>
			<span class="truncate">{triggerContent}</span>
			<div class="ml-2 flex-shrink-0">
				{#if isOpen}
					<ChevronUp class="h-4 w-4" />
				{:else}
					<ChevronDown class="h-4 w-4" />
				{/if}
			</div>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start" class="min-w-80 p-4 shadow-lg">
		<div class="space-y-6">
			<!-- Bedrooms Section -->
			<div class="space-y-3">
				<div class="flex items-center gap-2 border-b border-border pb-2">
					<Bed size={20} />
					<Label class="text-sm font-semibold text-foreground">Bedrooms</Label>
				</div>
				<ToggleGroup.Root
					variant="outline"
					type="single"
					class="grid w-full grid-cols-5 gap-2"
					bind:value={tempBeds}
				>
					{#each count as value ("beds" + value)}
						<ToggleGroup.Item
							{value}
							class="h-10 rounded-lg text-sm font-medium transition-colors hover:bg-primary/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							{value}
							{#if !exactBeds}
								<span class="text-xs opacity-70">+</span>
							{/if}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
				<div class="flex items-center gap-2 pt-1">
					<Checkbox bind:checked={exactBeds} class="data-[state=checked]:bg-primary" />
					<Label class="cursor-pointer text-sm text-muted-foreground">Use exact match</Label>
				</div>
			</div>

			<!-- Bathrooms Section -->
			<div class="space-y-3">
				<div class="flex items-center gap-2 border-b border-border pb-2">
					<Bath size={20} />
					<Label class="text-sm font-semibold text-foreground">Bathrooms</Label>
				</div>
				<ToggleGroup.Root
					variant="outline"
					type="single"
					class="grid w-full grid-cols-5 gap-2"
					bind:value={tempBaths}
				>
					{#each count as value ("baths" + value)}
						<ToggleGroup.Item
							{value}
							class="h-10 rounded-lg text-sm font-medium transition-colors hover:bg-primary/10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							{value}
							{#if !exactBaths}
								<span class="text-xs opacity-70">+</span>
							{/if}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
				<div class="flex items-center gap-2 pt-1">
					<Checkbox bind:checked={exactBaths} class="data-[state=checked]:bg-primary" />
					<Label class="cursor-pointer text-sm text-muted-foreground">Use exact match</Label>
				</div>
			</div>

			<!-- Apply Button -->
			<div class="border-t border-border pt-2">
				<Button
					onclick={applyChanges}
					class="h-10 w-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Apply Filters
				</Button>
			</div>
		</div>
	</DropdownMenu.Content>
</DropdownMenu.Root>

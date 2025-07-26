<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Edit, Share } from "@lucide/svelte";
	import { toTitleCase } from "$lib/utils";

	interface props {
		propertyName: string;
		price: number;
		listingType: "sale" | "rent" | "lease";
		category: string;
	}

	let { propertyName, price, listingType, category }: props = $props();

	function formatPrice(p: number) {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(p);
	}

	function getCategoryVariant(category: string) {
		const lowerCategory = category.toLowerCase();
		if (lowerCategory.includes("house") || lowerCategory.includes("home")) return "category-house";
		if (lowerCategory.includes("condo") || lowerCategory.includes("apartment"))
			return "category-condo";
		if (lowerCategory.includes("lot") || lowerCategory.includes("land")) return "category-lot";
		if (
			lowerCategory.includes("commercial") ||
			lowerCategory.includes("office") ||
			lowerCategory.includes("retail")
		)
			return "category-commercial";
		return "category";
	}
</script>

<div class="mb-3 flex items-start justify-between">
	<div>
		<div class="mb-2 flex items-center gap-3">
			<h1 class="text-3xl font-bold">
				{formatPrice(price)}
			</h1>
			<Badge variant={listingType} class="text-sm font-semibold capitalize">
				{listingType}
			</Badge>
		</div>
		<p class="mb-3 text-xl text-gray-600">
			{propertyName}
			<Badge variant={getCategoryVariant(category)}>{toTitleCase(category)}</Badge>
		</p>
	</div>
	<div class="flex gap-2">
		<!-- <Button variant="ghost" size="icon">
			<Edit class="size-4" />
		</Button> -->
		<Button variant="ghost" size="icon">
			<Share class="size-4" />
		</Button>
	</div>
</div>

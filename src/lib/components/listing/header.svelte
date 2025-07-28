<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { toTitleCase } from "$lib/utils";
	import { Share } from "@lucide/svelte";

	interface props {
		propertyName: string;
		price: number;
		listingType: "sale" | "rent" | "lease";
		category: string;
		status?: "up" | "pending" | "sold" | "under-review" | "submitted";
	}

	let { propertyName, price, listingType, category, status }: props = $props();

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

	function getStatusVariant(status: string) {
		switch (status) {
			case "sold":
				return "destructive";
			case "pending":
				return "secondary";
			case "under-review":
				return "outline";
			case "submitted":
				return "outline";
			case "up":
			default:
				return "default";
		}
	}

	function getStatusDisplay(status: string) {
		switch (status) {
			case "sold":
				return "SOLD";
			case "pending":
				return "Pending";
			case "under-review":
				return "Under Review";
			case "submitted":
				return "Submitted";
			case "up":
			default:
				return "Available";
		}
	}
</script>

<div class="mb-3 flex items-start justify-between gap-6">
	<div>
		<div class="mb-2 flex items-center gap-3">
			<h1 class="text-3xl font-bold">
				{formatPrice(price)}
			</h1>
		</div>
		<div class="mb-3 text-xl text-gray-600">
			<h1>{propertyName}</h1>
			<div class="mt-2 flex flex-wrap items-center gap-2">
				{#if status}
					<Badge
						variant={getStatusVariant(status)}
						class={status === "sold" ? "font-bold text-white" : ""}
					>
						{getStatusDisplay(status)}
					</Badge>
				{/if}
				<Badge variant={listingType}>
					For {toTitleCase(listingType)}
				</Badge>
				<Badge variant={getCategoryVariant(category)}>{toTitleCase(category)}</Badge>
			</div>
		</div>
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

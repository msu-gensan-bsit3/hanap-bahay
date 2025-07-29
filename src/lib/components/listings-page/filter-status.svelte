<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";
	import { cn } from "$lib/utils";

	const statuses = [
		{ value: "all", label: "All Status" },
		{ value: "up", label: "Active" },
		{ value: "pending", label: "Pending" },
		{ value: "sold", label: "Sold" },
		// { value: "under-review", label: "Under Review" },
		// { value: "submitted", label: "Submitted" },
	];

	let { status = $bindable() }: { status: string } = $props();

	const isActive = $derived(status !== "all");
</script>

<Select.Root type="single" bind:value={status}>
	<Select.Trigger
		class={cn("h-10 w-full min-w-29", isActive && "border-secondary bg-secondary/80")}
	>
		<span class="truncate">{statuses.find((s) => s.value === status)?.label || "Status"}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each statuses as stat (stat.value)}
				<Select.Item value={stat.value}>
					{stat.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

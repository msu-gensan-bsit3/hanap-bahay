<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Plus, Clock, Check } from "@lucide/svelte";

	export let historyItems: Array<{
		id: string;
		title: string;
		date: string;
		status: "created" | "pending" | "approved" | "rejected";
	}> = [];

	function getStatusIcon(status: string) {
		switch (status) {
			case "created":
				return Plus;
			case "pending":
				return Clock;
			case "approved":
				return Check;
			default:
				return Clock;
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "created":
				return "text-blue-500";
			case "pending":
				return "text-yellow-500";
			case "approved":
				return "text-green-500";
			case "rejected":
				return "text-red-500";
			default:
				return "text-gray-500";
		}
	}

	// Default data if none provided
	if (historyItems.length === 0) {
		historyItems = [
			{
				id: "1",
				title: "Listing Created",
				date: "Jul 25, 2023 • 10:30 AM",
				status: "created",
			},
			{
				id: "2",
				title: "Pending Review",
				date: "Jul 25, 2023 • 10:30 AM",
				status: "pending",
			},
			{
				id: "3",
				title: "Awaiting Approval",
				date: "",
				status: "pending",
			},
		];
	}
</script>

<Card class="property-card">
	<CardHeader>
		<CardTitle>Listing History</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			{#each historyItems as item (item.id)}
				<div class="flex items-start gap-3">
					<div class="mt-1 flex-shrink-0">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white {getStatusColor(
								item.status,
							)}"
						>
							<svelte:component this={getStatusIcon(item.status)} class="h-4 w-4" />
						</div>
					</div>
					<div class="flex-grow">
						<h4 class="font-medium text-gray-900">{item.title}</h4>
						{#if item.date}
							<p class="mt-1 text-sm text-gray-500">{item.date}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</CardContent>
</Card>

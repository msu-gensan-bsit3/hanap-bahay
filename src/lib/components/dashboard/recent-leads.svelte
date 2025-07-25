<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";

	interface Lead {
		id: number;
		name: string;
		interest: string;
		lastContact: string;
		status: string;
	}

	let { leads }: { leads: Lead[] } = $props();

	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case "new":
				return "bg-blue-100 text-blue-800";
			case "in negotiation":
				return "bg-purple-100 text-purple-800";
			case "meeting scheduled":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	let activeFilter = $state("all");
	const filters = [
		{ id: "all", label: "All" },
		{ id: "new", label: "New" },
		{ id: "in progress", label: "In Progress" },
	];

	let filteredLeads = $derived(
		activeFilter === "all"
			? leads
			: leads.filter((lead) => {
					if (activeFilter === "in progress") {
						return (
							lead.status.toLowerCase() === "in negotiation" ||
							lead.status.toLowerCase() === "meeting scheduled"
						);
					}
					return lead.status.toLowerCase() === activeFilter;
				}),
	);
</script>

<Card class="h-min">
	<CardHeader class="flex flex-row items-center justify-between">
		<CardTitle>Recent Leads</CardTitle>
		<div class="flex gap-8 text-sm">
			{#each filters as filter}
				<button
					class="transition-colors {activeFilter === filter.id
						? 'border-b border-blue-600 text-blue-600'
						: 'text-gray-500 hover:text-gray-700'} cursor-pointer pb-1"
					onclick={() => (activeFilter = filter.id)}
				>
					{filter.label}
				</button>
			{/each}
		</div>
	</CardHeader>
	<CardContent class="flex h-full flex-col justify-between px-0">
		<div>
			{#each filteredLeads as lead}
				<div class="h-[2px] w-full bg-black/10"></div>
				<div class="flex h-23 items-center space-x-4 p-4">
					<img src="/no-profile.jpg" alt={lead.name} class="h-10 w-10 rounded-full" />
					<div class="flex flex-1 flex-col gap-1 @lg:gap-[3px]">
						<h4 class="text-[14px] font-medium text-gray-900">{lead.name}</h4>
						<p class="text-xs text-gray-700">Interested in {lead.interest}</p>
						<p class="text-xs text-gray-900">Last contact: {lead.lastContact}</p>
					</div>
					<Badge class={getStatusColor(lead.status)}>
						{lead.status}
					</Badge>
				</div>
			{/each}
			<div class="h-[2px] w-full bg-black/10"></div>
		</div>
		<button
			class="mt-4 cursor-pointer px-4 text-xs text-blue-600 transition-colors hover:text-blue-800"
		>
			View all leads
		</button>
	</CardContent>
</Card>

<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

	interface MonthlyData {
		month: string;
		activeListings: number;
		leadsGenerated: number;
		conversions: number;
	}

	let { data }: { data: MonthlyData[] } = $props();

	let activeTab = $state("listings");

	const tabs = [
		{ id: "listings", label: "Listings" },
		{ id: "leads", label: "Leads" },
		{ id: "conversions", label: "Conversions" },
	];
</script>

<Card>
	<CardHeader>
		<CardTitle>Monthly Performance</CardTitle>
		<div class="flex space-x-6 text-sm">
			{#each tabs as tab}
				<button
					class="{activeTab === tab.id
						? 'border-b-2 border-blue-600 text-blue-600'
						: 'text-gray-500 hover:text-gray-700'} pb-1"
					onclick={() => (activeTab = tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</CardHeader>
	<CardContent>
		<div class="flex h-80 items-end justify-between space-x-2">
			{#each data as monthData}
				<div class="flex flex-1 flex-col items-center">
					<div class="relative h-64 w-full overflow-hidden rounded-t-lg bg-gray-100">
						<!-- Active Listings (Blue) -->
						<div
							class="absolute bottom-0 w-full bg-blue-500 opacity-80"
							style="height: {(monthData.activeListings / 60) * 100}%"
						></div>
						<!-- Leads Generated (Purple) -->
						<div
							class="absolute bottom-0 w-full bg-purple-500 opacity-60"
							style="height: {(monthData.leadsGenerated / 60) * 100}%"
						></div>
						<!-- Conversions (Green) -->
						<div
							class="absolute bottom-0 w-full bg-green-500 opacity-80"
							style="height: {(monthData.conversions / 60) * 100}%"
						></div>
					</div>
					<span class="mt-2 text-xs text-gray-500">{monthData.month}</span>
				</div>
			{/each}
		</div>
		<div class="mt-4 flex justify-center space-x-6 text-sm">
			<div class="flex items-center">
				<div class="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
				<span>Active Listings</span>
			</div>
			<div class="flex items-center">
				<div class="mr-2 h-3 w-3 rounded-full bg-purple-500"></div>
				<span>Leads Generated</span>
			</div>
			<div class="flex items-center">
				<div class="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
				<span>Conversions</span>
			</div>
		</div>
	</CardContent>
</Card>

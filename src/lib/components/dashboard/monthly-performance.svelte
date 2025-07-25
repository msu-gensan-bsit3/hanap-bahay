<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface MonthlyData {
		month: string;
		activeListings: number;
		leadsGenerated: number;
		conversions: number;
	}

	export let data: MonthlyData[];

	let activeTab = 'listings';

	const tabs = [
		{ id: 'listings', label: 'Listings' },
		{ id: 'leads', label: 'Leads' },
		{ id: 'conversions', label: 'Conversions' }
	];
</script>

<Card>
	<CardHeader>
		<CardTitle>Monthly Performance</CardTitle>
		<div class="flex space-x-6 text-sm">
			{#each tabs as tab}
				<button 
					class="{activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} pb-1"
					on:click={() => activeTab = tab.id}
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</CardHeader>
	<CardContent>
		<div class="h-80 flex items-end justify-between space-x-2">
			{#each data as monthData}
				<div class="flex flex-col items-center flex-1">
					<div class="relative w-full h-64 bg-gray-100 rounded-t-lg overflow-hidden">
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
					<span class="text-xs text-gray-500 mt-2">{monthData.month}</span>
				</div>
			{/each}
		</div>
		<div class="flex justify-center space-x-6 mt-4 text-sm">
			<div class="flex items-center">
				<div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
				<span>Active Listings</span>
			</div>
			<div class="flex items-center">
				<div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
				<span>Leads Generated</span>
			</div>
			<div class="flex items-center">
				<div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
				<span>Conversions</span>
			</div>
		</div>
	</CardContent>
</Card>

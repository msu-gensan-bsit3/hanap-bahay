<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import type { Agent } from "$lib/types";
	import { Search, Filter, RotateCcw } from "@lucide/svelte";

	// Props
	let {
		agents = [],
		selectedAgentId = $bindable(""),
		propertyCity = "",
		class: className = ""
	}: {
		agents: Agent[];
		selectedAgentId: string;
		propertyCity?: string;
		class?: string;
	} = $props();

	// Filter states
	let searchTerm = $state("");
	let locationFilter = $state("All Locations");
	let experienceFilter = $state("Any Experience");
	let sortBy = $state("Default");
	let showFilters = $state(false);

	// Filter and sort agents
	function filterAgents(agents: Agent[]) {
		return agents
			.filter((agent) => {
				// Search term filter
				const fullName = `${agent.user.firstName} ${agent.user.lastName}`.toLowerCase();
				const agentLocation = Object.values(agent.user.address).join(",");

				const matchesSearch =
					searchTerm.trim() === "" ||
					fullName.includes(searchTerm.toLowerCase()) ||
					agent.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					agent.about?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					agentLocation.toLowerCase().includes(searchTerm.toLowerCase());

				// Location filter
				const matchesLocation = locationFilter === "All Locations" || agentLocation.includes(locationFilter);

				// Experience filter
				const agentExperience = getExperienceYears(agent.user.dateCreated);
				const matchesExp = matchesExperience(agentExperience, experienceFilter);

				return matchesSearch && matchesLocation && matchesExp;
			})
			.sort((a, b) => {
				switch (sortBy) {
					case "Most Experienced":
						return getExperienceYears(b.user.dateCreated) - getExperienceYears(a.user.dateCreated);
					case "Newest Member":
						return new Date(b.user.dateCreated).getTime() - new Date(a.user.dateCreated).getTime();
					case "Name A-Z":
						return `${a.user.firstName} ${a.user.lastName}`.localeCompare(
							`${b.user.firstName} ${b.user.lastName}`,
						);
					case "Name Z-A":
						return `${b.user.firstName} ${b.user.lastName}`.localeCompare(
							`${a.user.firstName} ${a.user.lastName}`,
						);
					case "Location Match":
						// Prioritize agents from the same city
						const aLocationMatch = a.user.address.city.toLowerCase().includes(propertyCity.toLowerCase());
						const bLocationMatch = b.user.address.city.toLowerCase().includes(propertyCity.toLowerCase());
						if (aLocationMatch && !bLocationMatch) return -1;
						if (!aLocationMatch && bLocationMatch) return 1;
						return 0;
					default:
						// Default sorting prioritizes agents from same city
						if (propertyCity) {
							const aMatch = a.user.address.city.toLowerCase().includes(propertyCity.toLowerCase());
							const bMatch = b.user.address.city.toLowerCase().includes(propertyCity.toLowerCase());
							if (aMatch && !bMatch) return -1;
							if (!aMatch && bMatch) return 1;
						}
						return 0;
				}
			});
	}

	function getExperienceYears(dateCreated: Date) {
		return new Date().getFullYear() - dateCreated.getFullYear();
	}

	function matchesExperience(agentExperience: number, filter: string) {
		switch (filter) {
			case "0-2 years":
				return agentExperience <= 2;
			case "3-5 years":
				return agentExperience >= 3 && agentExperience <= 5;
			case "6-10 years":
				return agentExperience >= 6 && agentExperience <= 10;
			case "10+ years":
				return agentExperience > 10;
			default:
				return true;
		}
	}

	function resetFilters() {
		searchTerm = "";
		locationFilter = "All Locations";
		experienceFilter = "Any Experience";
		sortBy = "Default";
	}

	// Get unique locations from agents
	const agentLocations = $derived.by(() => {
		const locations = new Set<string>();
		agents.forEach(agent => {
			locations.add(agent.user.address.city);
			locations.add(agent.user.address.province);
		});
		return Array.from(locations).sort();
	});

	// Apply filters to agents - this will be reactive to all filter changes
	const filteredAgents = $derived.by(() => {
		return filterAgents(agents);
	});

	// Get selected agent info
	const selectedAgent = $derived(
		agents.find(agent => agent.user.id.toString() === selectedAgentId)
	);
</script>

<div class="space-y-4 {className}">
	<Label>Select Agent *</Label>

	<!-- Search and Filter Controls -->
	<div class="space-y-4">
		<!-- Search Bar -->
		<div class="relative">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				placeholder="Search by name, email, or skills..."
				bind:value={searchTerm}
				class="pl-10"
			/>
		</div>

		<!-- Filter Toggle Button (Mobile) -->
		<div class="flex items-center justify-between md:hidden">
			<Button
				type="button"
				variant="outline"
				size="sm"
				onclick={() => showFilters = !showFilters}
				class="flex items-center gap-2"
			>
				<Filter class="h-4 w-4" />
				Filters
				{#if showFilters}
					<span class="text-xs">(Hide)</span>
				{/if}
			</Button>

			{#if searchTerm || locationFilter !== "All Locations" || experienceFilter !== "Any Experience" || sortBy !== "Default"}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onclick={resetFilters}
					class="flex items-center gap-1"
				>
					<RotateCcw class="h-3 w-3" />
					Reset
				</Button>
			{/if}
		</div>

		<!-- Filter Controls -->
		<div class="grid grid-cols-1 gap-2 md:grid-cols-4 {showFilters || 'hidden md:grid'}">
			<!-- Location Filter -->
			<Select type="single" bind:value={locationFilter}>
				<SelectTrigger>
					<span class="truncate">{locationFilter}</span>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="All Locations">All Locations</SelectItem>
					{#each agentLocations as location}
						<SelectItem value={location}>{location}</SelectItem>
					{/each}
				</SelectContent>
			</Select>

			<!-- Experience Filter -->
			<Select type="single" bind:value={experienceFilter}>
				<SelectTrigger>
					<span class="truncate">{experienceFilter}</span>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="Any Experience">Any Experience</SelectItem>
					<SelectItem value="0-2 years">0-2 years</SelectItem>
					<SelectItem value="3-5 years">3-5 years</SelectItem>
					<SelectItem value="6-10 years">6-10 years</SelectItem>
					<SelectItem value="10+ years">10+ years</SelectItem>
				</SelectContent>
			</Select>

			<!-- Sort Options -->
			<Select type="single" bind:value={sortBy}>
				<SelectTrigger>
					<span class="truncate">{sortBy}</span>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="Default">Default</SelectItem>
					<SelectItem value="Most Experienced">Most Experienced</SelectItem>
					<SelectItem value="Newest Member">Newest Member</SelectItem>
					<SelectItem value="Name A-Z">Name A-Z</SelectItem>
					<SelectItem value="Name Z-A">Name Z-A</SelectItem>
					<SelectItem value="Location Match">Location Match</SelectItem>
				</SelectContent>
			</Select>

			<!-- Reset Button (Desktop) -->
			<div class="hidden md:flex">
				{#if searchTerm || locationFilter !== "All Locations" || experienceFilter !== "Any Experience" || sortBy !== "Default"}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onclick={resetFilters}
						class="flex items-center gap-2 w-full"
					>
						<RotateCcw class="h-4 w-4" />
						Reset Filters
					</Button>
				{/if}
			</div>
		</div>

		<!-- Results Count -->
		<div class="text-sm text-muted-foreground">
			{#if filteredAgents.length !== agents.length}
				Showing {filteredAgents.length} of {agents.length} agents
			{:else}
				{agents.length} agents available
			{/if}
		</div>
	</div>

	<!-- Agent Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border rounded-lg p-4">
		{#if filteredAgents.length > 0}
			{#each filteredAgents as agent (agent.user.id)}
				<button
					type="button"
					class="text-left p-0 h-auto border-0 bg-transparent hover:bg-transparent focus:bg-transparent"
					onclick={() => {
						selectedAgentId = agent.user.id.toString();
					}}
				>
					<div
						class="relative flex flex-col gap-0 overflow-hidden p-0 shadow-sm transition-all hover:shadow-md border rounded-lg {selectedAgentId === agent.user.id.toString() ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}"
					>
						<!-- Header with Profile Image and Basic Info -->
						<div class="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
							{#if selectedAgentId === agent.user.id.toString()}
								<div class="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
								</div>
							{/if}

							<div class="flex items-start gap-3">
								<!-- Profile Image -->
								<div class="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 shadow-md ring-2 ring-white">
									{#if agent.user.profilePicture}
										<img
											src={agent.user.profilePicture}
											alt="{agent.user.firstName} {agent.user.lastName}"
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600">
											{agent.user.firstName.charAt(0)}{agent.user.lastName.charAt(0)}
										</div>
									{/if}
								</div>

								<!-- Name and Credentials -->
								<div class="min-w-0 flex-1">
									<h3 class="truncate text-sm font-bold text-gray-900">
										{agent.user.firstName} {agent.user.lastName}
									</h3>
									<div class="mt-1">
										<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
											{agent.prcLicenceNumber ? "PRC #" + agent.prcLicenceNumber : "Agent"}
										</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Content -->
						<div class="p-4 pt-2">
							<!-- Location -->
							<div class="flex items-center gap-1 text-xs text-gray-600 mb-2">
								<svg class="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
								<span class="truncate">
									{agent.user.address.city}, {agent.user.address.province}
								</span>
							</div>

							<!-- About (truncated) -->
							{#if agent.about}
								<p class="line-clamp-2 text-xs text-gray-700 leading-relaxed mb-2">
									{agent.about}
								</p>
							{/if}

							<!-- Experience -->
							<div class="text-xs text-gray-600">
								<span>Experience: {new Date().getFullYear() - agent.user.dateCreated.getFullYear()} years</span>
							</div>
						</div>
					</div>
				</button>
			{/each}
		{:else}
			<div class="col-span-full text-center py-8 text-gray-500">
				<div class="flex flex-col items-center gap-2">
					<Search class="h-8 w-8 text-gray-400" />
					<p class="font-medium">No agents found</p>
					<p class="text-sm">Try adjusting your search or filters</p>
					{#if searchTerm || locationFilter !== "All Locations" || experienceFilter !== "Any Experience"}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onclick={resetFilters}
							class="mt-2"
						>
							Clear filters
						</Button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Selection Status -->
	{#if selectedAgent}
		<div class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
			<div class="w-2 h-2 bg-green-500 rounded-full"></div>
			<p class="text-sm text-green-700 font-medium">
				Selected: {selectedAgent.user.firstName} {selectedAgent.user.lastName}
			</p>
			<span class="text-xs text-green-600">
				({selectedAgent.user.address.city}, {selectedAgent.user.address.province})
			</span>
		</div>
	{:else}
		<p class="text-xs text-gray-500">
			Choose an agent to handle this listing. Agents from the same city are prioritized by default.
		</p>
	{/if}
</div>

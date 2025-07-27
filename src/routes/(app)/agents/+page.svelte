<script lang="ts">
	import CredentialsFilter from "$lib/components/listings-page/filter-agent-credentials.svelte";
	import ExperienceFilter from "$lib/components/listings-page/filter-agent-experience.svelte";
	import LocationFilter from "$lib/components/listings-page/filter-location.svelte";
	import SortAgents from "$lib/components/listings-page/sort-agents.svelte";

	import AgentCard from "$lib/components/listings-page/agent-card.svelte";
	import SkeletonAgentCard from "$lib/components/listings-page/skeleton-agent-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";

	import { replaceState } from "$app/navigation";
	import { page } from "$app/state";
	import { ChevronDown, ChevronUp, Funnel, RotateCcw, Search } from "@lucide/svelte";
	import { tick } from "svelte";

	// Filters - Initialize from URL params
	let searchTerm = $state(page.url.searchParams.get("search") || "");
	let location = $state(page.url.searchParams.get("location") || "All Locations");
	let credential = $state(page.url.searchParams.get("credential") || "All Credentials");
	let experience = $state(page.url.searchParams.get("experience") || "Any Experience");
	let sortBy: string = $state(page.url.searchParams.get("sort") || "Default");

	// Mobile filter visibility toggle
	let showFilters = $state(false);

	let { data } = $props();
	let { agents } = $derived(data);

	// svelte-ignore state_referenced_locally
	let filteredAgents = $derived(filter());
	let loading = $state(true);
	let timeoutId: NodeJS.Timeout;

	// pagination
	const perPage = 12;
	let pageNum = $derived.by(() => {
		filteredAgents;
		return parseInt(page.url.searchParams.get("page") || "1");
	});

	const count = $derived(filteredAgents.length);
	const totalPages = $derived(Math.ceil(count / perPage));
	const paginatedAgents = $derived(
		filteredAgents.slice((pageNum - 1) * perPage, pageNum * perPage),
	);

	function filter() {
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
				const matchesLocation = location === "All Locations" || agentLocation.includes(location);

				// Credential filter
				const matchesCredential =
					credential === "All Credentials" || agent.credentials === credential;

				// Experience filter
				const agentExperience = getExperienceYears(agent.user.dateCreated);
				const matchesExp = matchesExperience(agentExperience, experience);

				return matchesSearch && matchesLocation && matchesCredential && matchesExp;
			})
			.sort((a, b) => {
				switch (sortBy) {
					case "Highest Rated":
						return getMockRating() - getMockRating(); // Mock random sort
					case "Most Experienced":
						return getExperienceYears(b.user.dateCreated) - getExperienceYears(a.user.dateCreated);
					case "Newest Member":
						return new Date(b.user.dateCreated).getTime() - new Date(a.user.dateCreated).getTime();
					case "Most Active":
						return getMockActiveListings() - getMockActiveListings(); // Mock random sort
					case "Name A-Z":
						return `${a.user.firstName} ${a.user.lastName}`.localeCompare(
							`${b.user.firstName} ${b.user.lastName}`,
						);
					case "Name Z-A":
						return `${b.user.firstName} ${b.user.lastName}`.localeCompare(
							`${a.user.firstName} ${a.user.lastName}`,
						);
					default:
						return 0;
				}
			});
	}

	// Reset filters function
	function resetFilters() {
		searchTerm = "";
		location = "All Locations";
		credential = "All Credentials";
		experience = "Any Experience";
		sortBy = "Default";
		pageNum = 1;
		updateURL();
	}

	// Update URL with current filter values
	async function updateURL() {
		const url = new URL(page.url);

		// Clear existing params
		url.searchParams.delete("search");
		url.searchParams.delete("location");
		url.searchParams.delete("credential");
		url.searchParams.delete("experience");
		url.searchParams.delete("sort");
		url.searchParams.delete("page");

		// Set params only if they're not default values
		if (searchTerm.trim() !== "") {
			url.searchParams.set("search", searchTerm);
		}
		if (location !== "All Locations") {
			url.searchParams.set("location", location);
		}
		if (credential !== "All Credentials") {
			url.searchParams.set("credential", credential);
		}
		if (experience !== "Any Experience") {
			url.searchParams.set("experience", experience);
		}
		if (sortBy !== "Default") {
			url.searchParams.set("sort", sortBy);
		}
		if (pageNum > 1) {
			url.searchParams.set("page", pageNum.toString());
		}

		await tick();
		replaceState(url, {});
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
				return agentExperience >= 10;
			default:
				return true;
		}
	}

	// Mock rating function for sorting (in real app this would come from database)
	function getMockRating() {
		return 4.0 + Math.random() * 1.0;
	}

	function getMockActiveListings() {
		return Math.floor(Math.random() * 15) + 5;
	}

	//
	$effect(() => {
		loading = true;
		const _ = [sortBy, searchTerm, location, credential, experience];

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			// Reset to first page when filters change
			loading = false;
		}, 250);

		updateURL();
	});
</script>

<svelte:head>
	<title>Real Estate Agents - Find Your Perfect Agent</title>
	<meta
		name="description"
		content="Browse our network of professional real estate agents. Find experienced agents in your area to help you buy, sell, or rent properties."
	/>
</svelte:head>

<div class="min-h-screen w-full bg-background">
	<!-- Filters -->
	<div
		class="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="mx-auto max-w-7xl px-4 py-3">
			<!-- Mobile: Stacked layout -->
			<div class="flex flex-col gap-3 lg:hidden">
				<!-- Mobile Filter Toggle Button -->
				<div class="flex items-center justify-between">
					<div class="relative flex-1">
						<Search
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						/>
						<Input bind:value={searchTerm} placeholder="Search agents..." class="h-10 pl-9" />
					</div>
					<Button
						variant="outline"
						size="sm"
						class="ml-2 flex items-center gap-2"
						onclick={() => (showFilters = !showFilters)}
					>
						<Funnel class="h-4 w-4" />
						<span class="hidden sm:inline">Filters</span>
						{#if showFilters}
							<ChevronUp class="h-4 w-4" />
						{:else}
							<ChevronDown class="h-4 w-4" />
						{/if}
					</Button>
				</div>

				<!-- Collapsible Filters -->
				{#if showFilters}
					<div class="flex flex-col gap-3">
						<!-- Filter Row -->
						<div class="flex flex-wrap items-center gap-2">
							<div class="min-w-0 flex-1">
								<LocationFilter bind:location />
							</div>
							<div class="min-w-0 flex-1">
								<CredentialsFilter bind:credential />
							</div>
						</div>
						<!-- Filter Row 2 -->
						<div class="flex flex-wrap items-center gap-2">
							<div class="min-w-0 flex-1">
								<ExperienceFilter bind:experience />
							</div>
							<Button
								variant="outline"
								size="sm"
								class="flex items-center gap-1 px-3"
								onclick={resetFilters}
							>
								<RotateCcw class="h-4 w-4" />
								Reset
							</Button>
						</div>
					</div>
				{/if}
			</div>

			<!-- Desktop: Single row layout -->
			<div class="hidden items-center gap-3 lg:flex">
				<!-- Search Bar -->
				<div class="relative w-[200%] max-w-lg">
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						bind:value={searchTerm}
						placeholder="Search agents by name, email, or expertise..."
						class="h-10 pl-9"
					/>
				</div>
				<LocationFilter bind:location />
				<CredentialsFilter bind:credential />
				<ExperienceFilter bind:experience />
				<Button variant="outline" class="flex items-center gap-2" onclick={resetFilters}>
					<RotateCcw class="h-4 w-4" />
					Reset
				</Button>
			</div>
		</div>
	</div>

	<!-- Content -->
	<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
		<div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
			<div class="flex-grow">
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
					{#if searchTerm !== ""}
						Results for "{searchTerm}"
					{:else}
						Our Real Estate Agents
					{/if}
				</h1>
				<div class="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
					<p class="text-sm text-muted-foreground">
						{count} agents {#if totalPages > 1}• Page {pageNum} of {totalPages}{/if}
					</p>
					<SortAgents bind:sortBy />
				</div>
			</div>
		</div>

		<!-- Agents Grid -->
		<div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#if loading}
				{#each { length: 8 } as _}
					<div class="h-full">
						<SkeletonAgentCard />
					</div>
				{/each}
			{:else if paginatedAgents.length > 0}
				{#each paginatedAgents as agent (agent.user.id)}
					<div class="h-full">
						<AgentCard {agent} />
					</div>
				{/each}
			{:else}
				<div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
					<div class="mb-4 text-muted-foreground">
						<svg
							class="mx-auto mb-4 h-16 w-16"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						<h3 class="mb-2 text-lg font-medium">No agents found</h3>
						<p class="text-sm text-muted-foreground">
							Try adjusting your search criteria or filters
						</p>
					</div>
					<Button onclick={resetFilters} variant="outline">
						<RotateCcw class="mr-2 h-4 w-4" />
						Clear all filters
					</Button>
				</div>
			{/if}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div
				class="mt-8 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:mt-12 sm:pt-8"
			>
				<div class="flex items-center gap-2 sm:gap-4">
					<Button
						variant="outline"
						size="sm"
						disabled={pageNum <= 1}
						onclick={() => (pageNum = Math.max(1, pageNum - 1))}
						class="px-3 py-2 text-sm"
					>
						<span class="hidden sm:inline">Previous</span>
						<span class="sm:hidden">Prev</span>
					</Button>

					<div class="flex items-center gap-1 sm:gap-2">
						{#if totalPages <= 7}
							{#each Array(totalPages) as _, i}
								<Button
									variant={pageNum === i + 1 ? "default" : "outline"}
									size="sm"
									class="h-8 w-8 p-0 text-sm sm:h-10 sm:w-10"
									onclick={() => (pageNum = i + 1)}
								>
									{i + 1}
								</Button>
							{/each}
						{:else}
							<!-- Show simplified pagination for many pages -->
							<span class="px-2 py-2 text-xs text-muted-foreground sm:px-3 sm:text-sm">
								Page {pageNum} of {totalPages}
							</span>
						{/if}
					</div>

					<Button
						variant="outline"
						size="sm"
						disabled={pageNum >= totalPages}
						onclick={() => (pageNum = Math.min(totalPages, pageNum + 1))}
						class="px-3 py-2 text-sm"
					>
						<span class="hidden sm:inline">Next</span>
						<span class="sm:hidden">Next</span>
					</Button>
				</div>
			</div>
		{/if}
	</div>
</div>

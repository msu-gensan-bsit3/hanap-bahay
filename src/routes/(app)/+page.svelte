<script lang="ts">
	import AskAi from "$lib/components/ask-ai.svelte";
	import AgentCard from "$lib/components/listings-page/agent-card.svelte";
	import CarouselListingCard from "$lib/components/listings-page/carousel-listing-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";
	import { Label } from "$lib/components/ui/label/index";

	import * as Carousel from "$lib/components/ui/carousel/index.js";

	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { ChevronLast } from "@lucide/svelte";

	let { data } = $props();

	let searchQuery = $state("");

	const searchWithAi = moreEnhance({
		reset: false,
		onSubmitted: (res) => {
			if (res?.msg) {
				const msg = res.msg as string;
				console.log(msg);

				if (msg.startsWith("/listings") || msg.startsWith("/agents")) {
					window.location.href = msg;
					// goto(msg);
				}
			}
		},
	});
	const { enhance: searchEnhance, submitting: searchSubmitting } = $derived(searchWithAi);
</script>

<svelte:head>
	<title>JuanHome</title>
</svelte:head>

<div
	class="relative w-full bg-[url(https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iU07NrehBC9I/v0/-1x-1.webp)] bg-cover bg-center bg-no-repeat pb-5"
>
	<!-- Overlay for better text readability -->
	<div class="absolute inset-0 bg-black/40"></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="container mx-auto py-16 lg:py-24">
			<div class="mx-auto max-w-4xl text-center">
				<h1
					class="mb-8 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
				>
					In
					<span class="bg-gradient-to-r from-amber-300 to-red-500 bg-clip-text text-transparent">
						JuanHomes
					</span>
					you can find the
					<span class="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
						one
					</span>
					which feels like
					<span class="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
						home
					</span>
				</h1>

				<div class="mx-auto mt-25 mb-10 max-w-3xl">
					<div
						class="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/95 to-white/85 p-8 shadow-2xl backdrop-blur-sm"
					>
						<!-- AI Badge -->
						<div class="absolute top-4 right-4">
							<div
								class="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
							>
								<div class="h-2 w-2 animate-pulse rounded-full bg-white/80"></div>
								AI Powered
							</div>
						</div>

						<form
							action="?/searchWithAi"
							method="post"
							use:searchEnhance
							class="mt-4 space-y-6 min-[680px]:mt-0"
						>
							<div class="flex flex-col items-center space-y-2">
								<Label class="text-2xl leading-tight font-semibold text-gray-900">
									What's your dream property?
								</Label>
								<p class="mx-auto max-w-md text-sm text-gray-600">
									Describe what you're looking for in natural language. Our AI will find the perfect
									match.
								</p>
							</div>

							<div class="space-y-4">
								<div class="relative">
									<Input
										name="chatInput"
										placeholder="E.g., 'A 3-bedroom house near downtown with a garden and parking' or 'Affordable condo in Davao City'"
										class="h-14 flex-1 rounded-xl border-gray-200 pr-4 pl-12 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										bind:value={searchQuery}
										required
										disabled={searchSubmitting}
									/>
									<div class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
										<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
											/>
										</svg>
									</div>
								</div>

								<input type="hidden" name="sessionId" value={crypto.randomUUID()} />

								<div class="flex justify-center">
									<Button
										type="submit"
										size="lg"
										class="h-12 transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
										disabled={searchSubmitting}
									>
										{#if searchSubmitting}
											<div class="flex items-center gap-3">
												<div class="flex space-x-1">
													<div class="h-2 w-2 animate-pulse rounded-full bg-white/80"></div>
													<div
														class="h-2 w-2 animate-pulse rounded-full bg-white/80"
														style="animation-delay: 0.2s;"
													></div>
													<div
														class="h-2 w-2 animate-pulse rounded-full bg-white/80"
														style="animation-delay: 0.4s;"
													></div>
												</div>
												<span>AI Searching...</span>
											</div>
										{:else}
											<div class="flex items-center gap-2">
												<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M13 10V3L4 14h7v7l9-11h-7z"
													/>
												</svg>
												Search with AI
											</div>
										{/if}
									</Button>
								</div>
							</div>

							{#if searchSubmitting}
								<div class="text-center">
									<div
										class="inline-flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700"
									>
										<div class="flex space-x-1">
											<div class="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
											<div
												class="h-2 w-2 animate-bounce rounded-full bg-blue-500"
												style="animation-delay: 0.1s;"
											></div>
											<div
												class="h-2 w-2 animate-bounce rounded-full bg-blue-500"
												style="animation-delay: 0.2s;"
											></div>
										</div>
										<span class="font-medium"
											>AI is analyzing your request and finding perfect matches...</span
										>
									</div>
								</div>
							{/if}
						</form>

						<!-- Decorative elements -->
						<div
							class="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl"
						></div>
						<div
							class="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-br from-amber-400/20 to-red-400/20 blur-xl"
						></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Featured Listings Carousel -->
<div class="w-full bg-background px-4">
	{#await data.listings}
		<!-- Loading state for listings -->
		<div class="mx-auto my-8 max-w-screen-xl space-y-4">
			<div class="flex w-full items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold tracking-tight">Featured Listings</h2>
					<p class="text-sm text-muted-foreground">Loading premium properties...</p>
				</div>
			</div>
			<div class="flex gap-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="h-128 w-80 flex-shrink-0 animate-pulse rounded-lg bg-muted"></div>
				{/each}
			</div>
		</div>
	{:then featuredListings}
		<!-- Listings loaded successfully -->
		<Carousel.Root class="mx-auto my-8 max-w-screen-xl space-y-4">
			<div class="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
				<div>
					<h2 class="text-2xl font-bold tracking-tight">Featured Listings</h2>
					<p class="text-sm text-muted-foreground">{featuredListings.length} premium properties</p>
				</div>
				<div class="flex items-center justify-between gap-4">
					<Button variant="outline" size="sm" onclick={() => (window.location.href = "/listings")}>
						View All Listings
					</Button>
					<div class="mx-3 inline-flex gap-6">
						<Carousel.Previous />
						<Carousel.Next />
					</div>
				</div>
			</div>
			<Carousel.Content class="-ml-2 md:-ml-4">
				{#each featuredListings as listing}
					<Carousel.Item class="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3">
						<div class="h-128">
							<CarouselListingCard {...listing} />
						</div>
					</Carousel.Item>
				{/each}
				<Carousel.Item class="flex basis-auto items-center justify-center pl-2 md:pl-4">
					<a
						href="/listings"
						class="inline-flex rounded-lg border-2 border-dashed border-muted-foreground/25 px-8 py-4 text-muted-foreground transition-colors hover:border-muted-foreground/50"
					>
						See All Listings <ChevronLast strokeWidth={1} class="ml-2" />
					</a>
				</Carousel.Item>
			</Carousel.Content>
		</Carousel.Root>
	{:catch error}
		<!-- Error state for listings -->
		<div class="mx-auto my-8 max-w-screen-xl space-y-4">
			<div class="flex w-full items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold tracking-tight">Featured Listings</h2>
					<p class="text-sm text-red-500">Failed to load properties</p>
				</div>
			</div>
			<div
				class="flex items-center justify-center rounded-lg border-2 border-dashed border-red-200 py-12"
			>
				<div class="text-center">
					<p class="text-sm text-muted-foreground">{error.message}</p>
					<Button onclick={() => window.location.reload()} variant="outline" class="mt-2">
						Try again
					</Button>
				</div>
			</div>
		</div>
	{/await}
</div>

<!-- Featured Agents Carousel -->
<div class="w-full bg-muted/30 px-4">
	{#await data.agents}
		<!-- Loading state for agents -->
		<div class="mx-auto my-4 max-w-screen-xl space-y-4">
			<div class="flex w-full items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold tracking-tight">Featured Agents</h2>
					<p class="text-sm text-muted-foreground">Loading expert real estate professionals...</p>
				</div>
			</div>
			<div class="flex gap-4 overflow-hidden">
				{#each Array(4) as _}
					<div class="h-64 w-80 flex-shrink-0 animate-pulse rounded-lg bg-muted"></div>
				{/each}
			</div>
		</div>
	{:then featuredAgents}
		<!-- Agents loaded successfully -->
		<Carousel.Root class="mx-auto my-4 max-w-screen-xl space-y-4">
			<div class="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
				<div>
					<h2 class="text-2xl font-bold tracking-tight">Featured Agents</h2>
					<p class="text-sm text-muted-foreground">
						{featuredAgents.length} expert real estate professionals
					</p>
				</div>
				<div class="flex items-center justify-between gap-4">
					<Button variant="outline" size="sm" onclick={() => (window.location.href = "/agents")}>
						View All Agents
					</Button>
					<div class="mx-3 inline-flex gap-6">
						<Carousel.Previous />
						<Carousel.Next />
					</div>
				</div>
			</div>
			<Carousel.Content class="-ml-2 md:-ml-4">
				{#each featuredAgents as agent}
					<Carousel.Item class="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3">
						<div class="h-full">
							<AgentCard {agent} user={data.user} />
						</div>
					</Carousel.Item>
				{/each}
				{#if featuredAgents.length === 0}
					<Carousel.Item class="flex basis-auto items-center justify-center pl-2 md:pl-4">
						<div class="py-8 text-center text-muted-foreground">
							<p>No agents available</p>
						</div>
					</Carousel.Item>
				{/if}
				<Carousel.Item class="flex basis-auto items-center justify-center pl-2 md:pl-4">
					<a
						href="/agents"
						class="inline-flex rounded-lg border-2 border-dashed border-muted-foreground/25 px-8 py-4 text-muted-foreground transition-colors hover:border-muted-foreground/50"
					>
						See All Agents <ChevronLast strokeWidth={1} class="ml-2" />
					</a>
				</Carousel.Item>
			</Carousel.Content>
		</Carousel.Root>
	{:catch error}
		<!-- Error state for agents -->
		<div class="mx-auto my-4 max-w-screen-xl space-y-4">
			<div class="flex w-full items-center justify-between">
				<div>
					<h2 class="text-2xl font-bold tracking-tight">Featured Agents</h2>
					<p class="text-sm text-red-500">Failed to load agents</p>
				</div>
			</div>
			<div
				class="flex items-center justify-center rounded-lg border-2 border-dashed border-red-200 py-12"
			>
				<div class="text-center">
					<p class="text-sm text-muted-foreground">{error.message}</p>
					<Button onclick={() => window.location.reload()} variant="outline" class="mt-2">
						Try again
					</Button>
				</div>
			</div>
		</div>
	{/await}
</div>

<AskAi />

<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index";
	import { Button } from "$lib/components/ui/button/index";
	import * as Card from "$lib/components/ui/card/index";
	import type { User } from "$lib/server/db/schema";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import type { Agent } from "$lib/types";
	import { LoaderCircle, MapPin, MessageCircle, Star } from "@lucide/svelte";

	let { agent, user }: { agent: Agent; user?: Omit<User, "passwordHash"> | null } = $props();

	// Mock data for demo - in real app this would come from database
	const mockStats = {
		activeListings: Math.floor(Math.random() * 15) + 5,
		soldProperties: Math.floor(Math.random() * 50) + 10,
		rating: (4.0 + Math.random() * 1.0).toFixed(1),
		reviewCount: Math.floor(Math.random() * 100) + 20,
	};

	let profileImageLoaded = $state(false);

	const sendMessage = moreEnhance({ reset: false });
	const { enhance, submitting } = $derived(sendMessage);

	// Array of gradient backgrounds for profile placeholders
	const gradientBackgrounds = [
		"bg-gradient-to-br from-blue-500 to-indigo-600",
		"bg-gradient-to-br from-purple-500 to-pink-600",
		"bg-gradient-to-br from-green-500 to-emerald-600",
		"bg-gradient-to-br from-orange-500 to-red-600",
		"bg-gradient-to-br from-teal-500 to-cyan-600",
		"bg-gradient-to-br from-violet-500 to-purple-600",
		"bg-gradient-to-br from-rose-500 to-pink-600",
		"bg-gradient-to-br from-amber-500 to-orange-600",
		"bg-gradient-to-br from-lime-500 to-green-600",
		"bg-gradient-to-br from-sky-500 to-blue-600",
		"bg-gradient-to-br from-fuchsia-500 to-violet-600",
		"bg-gradient-to-br from-emerald-500 to-teal-600",
	];

	// Generate consistent random background based on agent ID
	function getRandomBackground() {
		const index = agent.user.id % gradientBackgrounds.length;
		return gradientBackgrounds[index];
	}

	function getExperienceYears(dateCreated: Date) {
		const years = new Date().getFullYear() - dateCreated.getFullYear();
		return years;
	}

	function getCredentialBadgeVariant(credentials: string) {
		if (credentials.includes("Senior") || credentials.includes("Broker")) {
			return "default";
		}
		if (credentials.includes("Specialist")) {
			return "secondary";
		}
		return "outline";
	}
</script>

<Card.Root
	class="relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg"
>
	<a href="/agents/{agent.user.id}" class="group block h-full">
		<!-- Header with Profile Image and Basic Info -->
		<div class="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
			<div class="flex items-start gap-4">
				<!-- Profile Image -->
				<div
					class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 shadow-md ring-4 ring-white"
				>
					{#if agent.user.profilePicture}
						{#if !profileImageLoaded}
							<div class="absolute inset-0 animate-pulse bg-muted">
								<div
									class="animate-shimmer h-full w-full bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
								></div>
							</div>
						{/if}
						<img
							src={agent.user.profilePicture}
							alt="{agent.user.firstName} {agent.user.lastName}"
							class="h-full w-full object-cover"
							onload={() => (profileImageLoaded = true)}
							referrerpolicy="no-referrer"
						/>
					{:else}
						<div
							class="flex h-full w-full items-center justify-center text-xl font-bold text-white {getRandomBackground()}"
						>
							{agent.user.firstName.charAt(0)}{agent.user.lastName.charAt(0)}
						</div>
					{/if}
				</div>

				<!-- Name and Credentials -->
				<div class="min-w-0 flex-1">
					<h3 class="truncate text-lg font-bold text-gray-900">
						{agent.user.firstName}
						{agent.user.lastName}
					</h3>
					<!-- variant={getCredentialBadgeVariant(agent.credentials || "default")} -->
					<Badge class="mt-1 text-xs" variant="outline">
						{agent.prcLicenceNumber
							? "PRC License #" + agent.prcLicenceNumber
							: "Real Estate Agent"}
					</Badge>
					<div class="mt-2 flex items-center gap-1 text-sm text-gray-600">
						<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span class="font-medium">{mockStats.rating}</span>
						<span>({mockStats.reviewCount} reviews)</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Content -->
		<Card.Content class="flex-1 p-6">
			<!-- Location -->
			<div class="mb-4 flex items-start gap-2">
				<MapPin class="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
				<p class="text-sm text-gray-600">
					{agent.user.address.city}, {agent.user.address.province}
				</p>
			</div>

			<!-- About -->
			<div class="mb-4">
				<p class="line-clamp-2 min-h-[3rem] text-sm leading-6 text-gray-700">
					{agent.about}
				</p>
			</div>

			<!-- Stats -->
			<div class="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 py-2">
				<div class="text-center">
					<p class="text-lg font-bold text-gray-900">{mockStats.activeListings}</p>
					<p class="text-xs text-gray-600">Active Listings</p>
				</div>
				<div class="text-center">
					<p class="text-lg font-bold text-gray-900">{mockStats.soldProperties}</p>
					<p class="text-xs text-gray-600">Properties Sold</p>
				</div>
			</div>

			<!-- Experience -->
			<div class="mb-0 flex items-center justify-between text-sm">
				<span class="text-gray-600">Experience:</span>
				<span class="font-medium text-gray-900"
					>{getExperienceYears(agent.user.dateCreated)} years</span
				>
			</div>

			<!-- Contact Info -->
			<!-- <div class="space-y-2 border-t pt-4">
				{#if agent.user.mobileNumber}
					<div class="flex items-center gap-2 text-sm">
						<Phone class="h-4 w-4 text-gray-500" />
						<span class="text-gray-700">{agent.user.mobileNumber}</span>
					</div>
				{/if}
				{#if agent.user.email}
					<div class="flex items-center gap-2 text-sm">
						<Mail class="h-4 w-4 text-gray-500" />
						<span class="truncate text-gray-700">{agent.user.email}</span>
					</div>
				{/if}
			</div> -->
		</Card.Content>
	</a>

	<!-- Footer -->
	<div class="border-t bg-gray-50 p-4">
		{#if user}
			<form method="POST" action="/agents/{agent.user.id}?/sendMessage" use:enhance>
				<input type="hidden" name="agentId" value={agent.user.id} />
				<Button class="w-full" size="sm" disabled={submitting} type="submit" variant="outline">
					{#if submitting}
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<MessageCircle class="mr-2 h-4 w-4" />
					{/if}
					Contact Agent
				</Button>
			</form>
		{:else}
			<Button class="w-full" size="sm" href="/login" variant="outline">
				<MessageCircle class="mr-2 h-4 w-4" />
				Contact Agent
			</Button>
		{/if}
	</div>
</Card.Root>

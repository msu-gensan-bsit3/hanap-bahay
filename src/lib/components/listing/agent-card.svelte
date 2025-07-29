<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import type { ClientListing } from "$lib/types";
	import { Mail, Phone } from "@lucide/svelte";

	interface props {
		agent: ClientListing["agent"];
		listingId: number;
		role: "anon" | "buyer" | "seller" | "agent";
		listingStatus?: "up" | "pending" | "sold" | "under-review" | "submitted" | "rejected";
	}

	let { agent, role, listingId, listingStatus }: props = $props();
</script>

{#if agent}
	<Card class="property-card">
		<CardHeader>
			<CardTitle>Listed By</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 gap-7 min-[700px]:grid-cols-2">
				<a href="/agents/{agent.user.id}" class="flex items-center gap-3">
					<div class="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
						{#if agent.user.profilePicture}
							<img
								src={agent.user.profilePicture}
								alt={`${agent.user.firstName} ${agent.user.lastName}`}
								class="h-full w-full object-cover"
								referrerpolicy="no-referrer"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-gray-300 text-lg font-medium text-gray-600"
							>
								{agent.user.firstName.charAt(0)}{agent.user.lastName.charAt(0)}
							</div>
						{/if}
					</div>
					<div>
						<p class="font-medium">
							{agent.user.firstName}
							{agent.user.lastName}
						</p>
						<p class="text-sm text-gray-500">{agent.credentials}</p>
					</div>
				</a>
				<div class="flex flex-col gap-3">
					{#if agent.user.mobileNumber}
						<div class="flex items-center gap-2">
							<Phone class="size-4" />
							<p class="text-sm font-medium">
								{agent.user.mobileNumber}
							</p>
						</div>
					{/if}
					{#if agent.user.email}
						<div class="flex items-center gap-2">
							<Mail class="size-4" />
							<p class="text-sm font-medium">
								{agent.user.email}
							</p>
						</div>
					{/if}
				</div>
			</div>
			<!-- Additional Agent Info -->
			{#if listingStatus === "sold"}
				<div class="mt-5 hidden rounded-lg bg-red-50 px-4 py-3 text-center">
					<p class="text-sm font-medium text-red-800">This property has been sold</p>
					<p class="text-xs text-red-600">Contact the agent for similar properties</p>
				</div>
			{:else}
				<div class="mt-5 rounded-lg bg-blue-50 px-4 py-3 text-center">
					<p class="text-sm text-blue-800">
						<a href="/agents/{agent.user.id}" class="font-medium hover:underline">
							View agent profile
						</a>
						for more listings and information
					</p>
				</div>
			{/if}
		</CardContent>
	</Card>
{/if}

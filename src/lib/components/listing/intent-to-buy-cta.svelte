<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import type { ClientListing } from "$lib/types";
	import { LoaderCircle, MessageCircle, Phone } from "@lucide/svelte";

	interface props {
		agent: ClientListing["agent"];
		listingId: number;
		role: "anon" | "buyer" | "seller" | "agent";
		listingStatus?: "up" | "pending" | "sold" | "under-review" | "submitted";
	}

	let { agent, role, listingId, listingStatus }: props = $props();

	const sendMessage = moreEnhance({ reset: false });
	const { enhance, submitting } = $derived(sendMessage);
</script>

{#if role !== "anon" && role !== "agent" && listingStatus !== "sold"}
	<Card class="mb-5 border border-blue-200 bg-blue-50/50 p-0 shadow-sm">
		<CardContent class="p-4">
			<div class="flex items-center justify-between gap-4">
				<!-- Agent Info -->
				<div class="flex items-center gap-3">
					<div class="hidden h-10 w-10 overflow-hidden rounded-full bg-gray-200 md:block">
						{#if agent.user.profilePicture}
							<img
								src={agent.user.profilePicture}
								alt={`${agent.user.firstName} ${agent.user.lastName}`}
								class="h-full w-full object-cover"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-blue-100 text-sm font-semibold text-blue-600"
							>
								{agent.user.firstName.charAt(0)}{agent.user.lastName.charAt(0)}
							</div>
						{/if}
					</div>
					<div>
						<p class="font-semibold text-gray-900">
							{agent.user.firstName}
							{agent.user.lastName}
						</p>
						<p class="hidden text-xs text-gray-600 md:block">Interested in this property?</p>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-2">
					<form method="POST" action="?/sendMessage" use:enhance>
						<input type="hidden" name="agentId" value={agent.user.id} />
						<input type="hidden" name="listingId" value={listingId} />
						<Button
							class="bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
							disabled={submitting}
							type="submit"
						>
							{#if submitting}
								<LoaderCircle class="mr-2 size-4 animate-spin" />
								Sending...
							{:else}
								<MessageCircle class="mr-2 size-4" />
								Express Interest
							{/if}
						</Button>
					</form>

					{#if agent.user.mobileNumber}
						<Button
							variant="outline"
							class="border-blue-200 px-4 py-2 text-blue-600 hover:bg-blue-50"
							onclick={() => window.open(`tel:${agent.user.mobileNumber}`, "_self")}
						>
							<Phone class="size-4" />
						</Button>
					{/if}
				</div>
			</div>
		</CardContent>
	</Card>
{:else if listingStatus === "sold"}
	<Card class="mb-5 hidden border border-red-200 bg-red-50/50 p-0 shadow-sm">
		<CardContent class="p-4">
			<div class="flex items-center justify-center gap-3">
				<div class="hidden h-8 w-8 overflow-hidden rounded-full bg-gray-200">
					{#if agent.user.profilePicture}
						<img
							src={agent.user.profilePicture}
							alt={`${agent.user.firstName} ${agent.user.lastName}`}
							class="h-full w-full object-cover"
						/>
					{:else}
						<div
							class="flex h-full w-full items-center justify-center bg-red-100 text-xs font-medium text-red-600"
						>
							{agent.user.firstName.charAt(0)}{agent.user.lastName.charAt(0)}
						</div>
					{/if}
				</div>
				<div class="text-center">
					<p class="font-medium text-red-800">Property Sold</p>
					<p class="text-xs text-red-600">Contact {agent.user.firstName} for similar properties</p>
				</div>
			</div>
		</CardContent>
	</Card>
{/if}

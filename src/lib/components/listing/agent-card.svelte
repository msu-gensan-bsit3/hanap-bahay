<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import type { ClientListing } from "$lib/types";
	import { Mail, Phone, MessageCircle, LoaderCircle } from "@lucide/svelte";
	import { moreEnhance } from "$lib/states/enhance.svelte";

	interface props {
		agent: ClientListing["agent"];
		listingId: number;
		role: "anon" | "buyer" | "seller" | "agent";
	}

	let { agent, role, listingId }: props = $props();

	const sendMessage = moreEnhance({ reset: false });
	const { enhance, submitting } = $derived(sendMessage);
</script>

{#if agent}
	<Card class="property-card">
		<CardHeader>
			<CardTitle>Listed By</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 gap-7 min-[700px]:grid-cols-2">
				<div class="flex items-center gap-3">
					<div class="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
						{#if agent.user.profilePicture}
							<img
								src={agent.user.profilePicture}
								alt={`${agent.user.firstName} ${agent.user.lastName}`}
								class="h-full w-full object-cover"
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
				</div>
				<div class="flex flex-col gap-3">
					{#if agent.user.mobileNumber}
						<div class="flex items-center gap-2">
							<Phone class="size-4" />
							<p class="text-sm font-medium">{agent.user.mobileNumber}</p>
						</div>
					{/if}
					{#if agent.user.email}
						<div class="flex items-center gap-2">
							<Mail class="size-4" />
							<p class="text-sm font-medium">{agent.user.email}</p>
						</div>
					{/if}
				</div>
			</div>
			<!-- {#if role === "buyer"} -->
			<form method="POST" action="?/sendMessage" use:enhance>
				<input type="hidden" name="agentId" value={agent.user.id} />
				<input type="hidden" name="listingId" value={listingId} />
				<Button variant="outline" size="sm" class="mt-5" disabled={submitting} type="submit">
					{#if submitting}
						<LoaderCircle class="mr-2 size-4 animate-spin" />
					{:else}
						<MessageCircle class="mr-2 size-4" />
					{/if}
					Send Message
				</Button>
			</form>
			<!-- {/if} -->
		</CardContent>
	</Card>
{/if}

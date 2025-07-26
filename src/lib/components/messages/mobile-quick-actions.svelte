<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { CalendarCheck, Eye, FileText, X, type IconProps } from "@lucide/svelte";
	import type { Component } from "svelte";

	interface props {
		selectedConversation: {
			property: string;
		};
		onQuickResponse: (message: string) => void;
	}

	let { selectedConversation, onQuickResponse }: props = $props();

	let showQuickActions = $state(false);

	function toggleQuickActions() {
		showQuickActions = !showQuickActions;
	}
</script>

<!-- Mobile Quick Actions Floating Button -->
<div class="fixed right-8 bottom-42 z-50 flex flex-col items-end">
	{#if showQuickActions}
		<!-- Quick Actions Overlay -->
		<div class="mb-4">
			<Card class="w-72 py-0 shadow-lg">
				<CardContent class="space-y-3 p-4">
					<div class="border-b pb-3">
						<h4 class="text-sm font-medium text-gray-900">{selectedConversation.property}</h4>
						<p class="text-xs text-gray-600">3 BR • 2 BA • 140 sqm</p>
						<p class="mt-1 text-sm font-semibold text-blue-600">₱5,500,000</p>
					</div>

					<div class="space-y-2">
						{#snippet btn(name: string, Icon: Component<IconProps>)}
							<Button
								variant="outline"
								size="sm"
								class="flex w-full items-center justify-start gap-3 text-xs"
							>
								<Icon />
								{name}
							</Button>
						{/snippet}

						{@render btn("View Property", Eye)}
						{@render btn("Schedule Viewing", CalendarCheck)}
						{@render btn("Send Brochure", FileText)}
					</div>

					<div class="space-y-2 border-t pt-3">
						<p class="text-xs font-medium text-gray-700">Quick Responses</p>
						<Button
							variant="ghost"
							size="sm"
							class="h-auto w-full justify-start p-2 text-left"
							onclick={() => {
								onQuickResponse(
									"Thank you for your interest! I'd be happy to schedule a property viewing for you.",
								);
								showQuickActions = false;
							}}
						>
							<div class="text-xs">
								<div class="text-left font-medium">Schedule Viewing</div>
								<div class="truncate text-gray-500">Thank you for your interest...</div>
							</div>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							class="h-auto w-full justify-start p-2 text-left"
							onclick={() => {
								onQuickResponse(
									"I'll send you the complete property details and floor plans shortly.",
								);
								showQuickActions = false;
							}}
						>
							<div class="text-xs">
								<div class="text-left font-medium">Send Details</div>
								<div class="truncate text-gray-500">I'll send you the complete...</div>
							</div>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							class="h-auto w-full justify-start p-2 text-left"
							onclick={() => {
								onQuickResponse(
									"The property is still available. Would you like to discuss the terms?",
								);
								showQuickActions = false;
							}}
						>
							<div class="text-xs">
								<div class="text-left font-medium">Availability</div>
								<div class="truncate text-gray-500">The property is still available...</div>
							</div>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	{/if}

	<!-- Floating Action Button -->
	<Button
		onclick={toggleQuickActions}
		class="size-10 rounded-full opacity-40 shadow-lg transition-colors hover:opacity-100 
		{showQuickActions ? 'bg-gray-600 opacity-100 hover:bg-gray-700' : ''}"
		size="icon"
	>
		{#if showQuickActions}
			<X />
		{:else}
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
			</svg>
		{/if}
	</Button>
</div>

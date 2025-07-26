<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";

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
<div class="fixed bottom-42 right-8 z-50 flex flex-col items-end">
	{#if showQuickActions}
		<!-- Quick Actions Overlay -->
		<div class="mb-4">
			<Card class="w-72 shadow-lg">
				<CardContent class="space-y-3 p-4">
					<div class="border-b pb-3">
						<h4 class="text-sm font-medium text-gray-900">{selectedConversation.property}</h4>
						<p class="text-xs text-gray-600">3 BR • 2 BA • 140 sqm</p>
						<p class="mt-1 text-sm font-semibold text-blue-600">₱5,500,000</p>
					</div>

					<div class="space-y-2">
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							<svg class="mr-2 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							View Property
						</Button>
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							<svg class="mr-2 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h4z"
								/>
							</svg>
							Schedule Viewing
						</Button>
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							<svg class="mr-2 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							Send Brochure
						</Button>
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
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
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

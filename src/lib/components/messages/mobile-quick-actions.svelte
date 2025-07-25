<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";

	export let selectedConversation: {
		property: string;
	};
	export let onQuickResponse: (message: string) => void;

	let showQuickActions = false;

	function toggleQuickActions() {
		showQuickActions = !showQuickActions;
	}
</script>

<!-- Mobile Quick Actions Floating Button -->
<div class="fixed bottom-20 right-4 z-50 lg:hidden">
	{#if showQuickActions}
		<!-- Quick Actions Overlay -->
		<div class="mb-4">
			<Card class="w-72 shadow-lg">
				<CardContent class="p-4 space-y-3">
					<div class="border-b pb-3">
						<h4 class="font-medium text-gray-900 text-sm">{selectedConversation.property}</h4>
						<p class="text-xs text-gray-600">3 BR • 2 BA • 140 sqm</p>
						<p class="text-sm font-semibold text-blue-600 mt-1">₱5,500,000</p>
					</div>
					
					<div class="space-y-2">
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							<svg class="h-3 w-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
							View Property
						</Button>
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							<svg class="h-3 w-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
							</svg>
							Schedule Viewing
						</Button>
						<Button variant="outline" size="sm" class="w-full justify-start text-xs">
							<svg class="h-3 w-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Send Brochure
						</Button>
					</div>

					<div class="border-t pt-3 space-y-2">
						<p class="text-xs font-medium text-gray-700">Quick Responses</p>
						<Button 
							variant="ghost" 
							size="sm" 
							class="w-full justify-start text-left h-auto p-2" 
							onclick={() => {
								onQuickResponse("Thank you for your interest! I'd be happy to schedule a property viewing for you.");
								showQuickActions = false;
							}}
						>
							<div class="text-xs">
								<div class="font-medium text-left">Schedule Viewing</div>
								<div class="text-gray-500 truncate">Thank you for your interest...</div>
							</div>
						</Button>
						<Button 
							variant="ghost" 
							size="sm" 
							class="w-full justify-start text-left h-auto p-2"
							onclick={() => {
								onQuickResponse("I'll send you the complete property details and floor plans shortly.");
								showQuickActions = false;
							}}
						>
							<div class="text-xs">
								<div class="font-medium text-left">Send Details</div>
								<div class="text-gray-500 truncate">I'll send you the complete...</div>
							</div>
						</Button>
						<Button 
							variant="ghost" 
							size="sm" 
							class="w-full justify-start text-left h-auto p-2"
							onclick={() => {
								onQuickResponse("The property is still available. Would you like to discuss the terms?");
								showQuickActions = false;
							}}
						>
							<div class="text-xs">
								<div class="font-medium text-left">Availability</div>
								<div class="text-gray-500 truncate">The property is still available...</div>
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
		class="h-12 w-12 rounded-full shadow-lg {showQuickActions ? 'bg-gray-600 hover:bg-gray-700' : ''}"
		size="icon"
	>
		{#if showQuickActions}
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
		{/if}
	</Button>
</div>

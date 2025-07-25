<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";

	interface props {
		selectedConversation: {
			property: string;
		};
		onQuickResponse: (message: string) => void;
	}

	let { selectedConversation, onQuickResponse }: props = $props();
</script>

<div class="hidden w-80 flex-col gap-4 @7xl:flex">
	<Card>
		<CardHeader>
			<CardTitle class="text-sm">Property Details</CardTitle>
		</CardHeader>
		<CardContent class="space-y-3">
			<div>
				<h4 class="font-medium text-gray-900">{selectedConversation.property}</h4>
				<p class="text-sm text-gray-600">3 BR • 2 BA • 140 sqm</p>
				<p class="mt-1 text-lg font-semibold text-blue-600">₱5,500,000</p>
			</div>
			<div class="flex flex-col gap-2">
				<Button variant="outline" size="sm" class="w-full justify-start">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				<Button variant="outline" size="sm" class="w-full justify-start">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h4z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 10v10a1 1 0 001 1h10a1 1 0 001-1V10H6z"
						/>
					</svg>
					Schedule Viewing
				</Button>
				<Button variant="outline" size="sm" class="w-full justify-start">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle class="text-sm">Quick Responses</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			<Button
				variant="ghost"
				size="sm"
				class="h-auto w-full justify-start p-3 text-left"
				onclick={() =>
					onQuickResponse(
						"Thank you for your interest! I'd be happy to schedule a property viewing for you.",
					)}
			>
				<div class="text-xs">
					<div class="font-medium">Schedule Viewing</div>
					<div class="truncate text-gray-500">Thank you for your interest! I'd be happy to...</div>
				</div>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				class="h-auto w-full justify-start p-3 text-left"
				onclick={() =>
					onQuickResponse("I'll send you the complete property details and floor plans shortly.")}
			>
				<div class="text-xs">
					<div class="font-medium">Send Details</div>
					<div class="truncate text-gray-500">I'll send you the complete property details...</div>
				</div>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				class="h-auto w-full justify-start p-3 text-left"
				onclick={() =>
					onQuickResponse("The property is still available. Would you like to discuss the terms?")}
			>
				<div class="text-xs">
					<div class="font-medium">Availability</div>
					<div class="truncate text-gray-500">The property is still available. Would you...</div>
				</div>
			</Button>
		</CardContent>
	</Card>
</div>

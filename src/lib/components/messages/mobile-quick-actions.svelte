<script lang="ts">
	import { goto } from "$app/navigation";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";
	import type { Property } from "$lib/server/db/schema";
	import { Calendar, Eye, FileText, MessageSquare, Send, X, type IconProps } from "@lucide/svelte";
	import type { Component } from "svelte";

	interface props {
		properties: (Property & { listingId: number })[];
		onQuickResponse: (message: string) => void;
		role: "agent" | "user";
	}

	let { onQuickResponse, properties, role }: props = $props();

	// Derived values for role-based UI
	let isAgent = $derived(role === "agent");
	let isUser = $derived(role === "user");

	let showQuickActions = $state(false);
	let property = $derived(properties?.at(0)); // TODO: temp

	let propertyType = $derived(() => {
		if (!property?.category) return "Property";
		return property.category
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	});

	let details = $derived.by(() => {
		if (!property) {
			return;
		}

		const details: string[] = [];

		const isLandProperty = ["commercial-lot", "residential-lot", "industrial-lot"].includes(
			property?.category,
		);
		const area = (isLandProperty ? property.landArea : property.floorArea) || property.landArea;
		if (property?.bedrooms && property?.bedrooms > 0) {
			details.push(`${property.bedrooms} BR`);
		}
		if (property?.bathrooms && property?.bathrooms > 0) {
			details.push(`${property.bathrooms} BA`);
		}
		if (area && area > 0) {
			details.push(`${area} sqm`);
		}

		return details.join(" • ");
	});

	function toggleQuickActions() {
		showQuickActions = !showQuickActions;
	}
</script>

<!-- Mobile Quick Actions Floating Button -->
{#if property}
	<div class="fixed right-8 bottom-42 z-50 flex flex-col items-end">
		{#if showQuickActions && property}
			<!-- Quick Actions Overlay -->
			<div class="mb-4">
				<Card
					class="w-72 py-0 shadow-lg {isAgent ? 'ring-1 ring-blue-100' : 'ring-1 ring-green-100'}"
				>
					<CardContent class="space-y-3 p-4">
						<!-- Property Header with Role Indicator -->
						<div class="border-b pb-3">
							<div class="mb-2 flex items-center justify-between">
								<Badge
									variant="secondary"
									class="bg-white text-xs {isAgent ? 'text-blue-600' : 'text-green-600'}"
								>
									{isAgent ? "Agent View" : "Buyer View"}
								</Badge>
								<Badge variant="outline" class="text-xs">
									{propertyType()}
								</Badge>
							</div>
							<h4 class="text-sm font-medium text-gray-900">
								{property.name}
							</h4>
							<p class="text-xs text-gray-600">{details}</p>
							<p class="mt-1 text-sm font-semibold {isAgent ? 'text-blue-600' : 'text-green-600'}">
								₱{property.price.toLocaleString()}
							</p>
						</div>

						<!-- Action Buttons -->
						<div class="space-y-2">
							{#snippet btn(
								name: string,
								Icon: Component<IconProps>,
								onclick?: () => void,
								variant: "default" | "outline" = "outline",
							)}
								<Button
									{variant}
									size="sm"
									class="flex w-full items-center justify-start gap-3 text-xs {variant === 'default'
										? isAgent
											? 'bg-blue-600 hover:bg-blue-700'
											: 'bg-green-600 hover:bg-green-700'
										: ''}"
									{onclick}
								>
									<Icon />
									{name}
								</Button>
							{/snippet}

							{#if isAgent}
								{@render btn("View Property", Eye, () => {
									goto("/listings/" + property?.listingId);
									showQuickActions = false;
								})}
							{:else}
								{@render btn(
									"Book Viewing",
									Calendar,
									() => {
										onQuickResponse(
											"I would like to schedule a viewing for this property. When would be a good time?",
										);
										showQuickActions = false;
									},
									"default",
								)}
								{@render btn("Get Info", FileText, () => {
									onQuickResponse("Could you please send me more details about this property?");
									showQuickActions = false;
								})}
							{/if}
						</div>

						<!-- Quick Responses Section -->
						<div class="space-y-2 border-t pt-3">
							<p class="text-xs font-medium {isAgent ? 'text-blue-700' : 'text-green-700'}">
								{isAgent ? "Quick Responses" : "Express Interest"}
							</p>

							{#if isAgent}
								<!-- Agent Quick Responses -->
								<Button
									variant="ghost"
									size="sm"
									class="h-auto w-full justify-start p-2 text-left hover:bg-blue-50"
									onclick={() => {
										onQuickResponse(
											"Thank you for your interest! I'd be happy to schedule a property viewing for you. When would be the best time for you?",
										);
										showQuickActions = false;
									}}
								>
									<div class="flex items-start gap-2">
										<div class="mt-1 rounded-full bg-blue-100 p-1">
											<Calendar class="h-3 w-3 text-blue-600" />
										</div>
										<div class="text-xs">
											<div class="text-left font-medium">Schedule Viewing</div>
											<div class="truncate text-gray-500">Thank you for your interest...</div>
										</div>
									</div>
								</Button>

								<Button
									variant="ghost"
									size="sm"
									class="h-auto w-full justify-start p-2 text-left hover:bg-green-50"
									onclick={() => {
										onQuickResponse(
											"I'll send you the complete property details, floor plans, and additional photos right away.",
										);
										showQuickActions = false;
									}}
								>
									<div class="flex items-start gap-2">
										<div class="mt-1 rounded-full bg-green-100 p-1">
											<FileText class="h-3 w-3 text-green-600" />
										</div>
										<div class="text-xs">
											<div class="text-left font-medium">Send Details</div>
											<div class="truncate text-gray-500">I'll send you complete details...</div>
										</div>
									</div>
								</Button>

								<Button
									variant="ghost"
									size="sm"
									class="h-auto w-full justify-start p-2 text-left hover:bg-amber-50"
									onclick={() => {
										onQuickResponse(
											"Yes, the property is still available! Would you like to discuss the terms or schedule a viewing?",
										);
										showQuickActions = false;
									}}
								>
									<div class="flex items-start gap-2">
										<div class="mt-1 rounded-full bg-amber-100 p-1">
											<Send class="h-3 w-3 text-amber-600" />
										</div>
										<div class="text-xs">
											<div class="text-left font-medium">Confirm Availability</div>
											<div class="truncate text-gray-500">Yes, it's still available...</div>
										</div>
									</div>
								</Button>
							{:else}
								<!-- User Quick Actions -->
								<Button
									variant="ghost"
									size="sm"
									class="h-auto w-full justify-start p-2 text-left hover:bg-green-50"
									onclick={() => {
										onQuickResponse(
											"Hi! I'm very interested in this property. Could you please provide more information and schedule a viewing?",
										);
										showQuickActions = false;
									}}
								>
									<div class="flex items-start gap-2">
										<div class="mt-1 rounded-full bg-green-100 p-1">
											<Eye class="h-3 w-3 text-green-600" />
										</div>
										<div class="text-xs">
											<div class="text-left font-medium">Express Interest</div>
											<div class="truncate text-gray-500">I'm very interested in this...</div>
										</div>
									</div>
								</Button>

								<Button
									variant="ghost"
									size="sm"
									class="h-auto w-full justify-start p-2 text-left hover:bg-blue-50"
									onclick={() => {
										onQuickResponse(
											"I have some questions about this property. Could you tell me more about the neighborhood and amenities?",
										);
										showQuickActions = false;
									}}
								>
									<div class="flex items-start gap-2">
										<div class="mt-1 rounded-full bg-blue-100 p-1">
											<MessageSquare class="h-3 w-3 text-blue-600" />
										</div>
										<div class="text-xs">
											<div class="text-left font-medium">Ask Questions</div>
											<div class="truncate text-gray-500">Tell me about the neighborhood...</div>
										</div>
									</div>
								</Button>

								<Button
									variant="ghost"
									size="sm"
									class="h-auto w-full justify-start p-2 text-left hover:bg-purple-50"
									onclick={() => {
										onQuickResponse(
											"Is there any flexibility with the price? I'd like to discuss the terms and make an offer.",
										);
										showQuickActions = false;
									}}
								>
									<div class="flex items-start gap-2">
										<div class="mt-1 rounded-full bg-purple-100 p-1">
											<Send class="h-3 w-3 text-purple-600" />
										</div>
										<div class="text-xs">
											<div class="text-left font-medium">Discuss Price</div>
											<div class="truncate text-gray-500">Any flexibility with price...</div>
										</div>
									</div>
								</Button>
							{/if}
						</div>
					</CardContent>
				</Card>
			</div>
		{/if}

		<!-- Floating Action Button -->
		<Button
			onclick={toggleQuickActions}
			class="size-10 rounded-full shadow-lg transition-all duration-200 hover:scale-110
		{showQuickActions
				? isAgent
					? 'bg-blue-600 opacity-100 hover:bg-blue-700'
					: 'bg-green-600 opacity-100 hover:bg-green-700'
				: isAgent
					? 'bg-blue-500 opacity-60 hover:bg-blue-600 hover:opacity-90'
					: 'bg-green-500 opacity-60 hover:bg-green-600 hover:opacity-90'}"
			size="icon"
			title={isAgent ? "Agent Quick Responses" : "Property Actions"}
		>
			{#if showQuickActions}
				<X class="text-white" />
			{:else if isAgent}
				<MessageSquare class="h-5 w-5 text-white" />
			{:else}
				<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
{/if}

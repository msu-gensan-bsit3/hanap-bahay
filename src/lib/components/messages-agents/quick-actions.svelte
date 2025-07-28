<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import type { Property } from "$lib/server/db/schema";
	import {
		Bath,
		Bed,
		Calendar,
		Eye,
		FileText,
		Home,
		MapPin,
		MessageSquare,
		Ruler,
		Send,
	} from "@lucide/svelte";

	interface props {
		properties?: (Property & { listingId: number })[];
		onQuickResponse: (message: string) => void;
		role: "user" | "agent";
		propertyImages?: Record<number, string[]>;
		propertyLocations?: Record<number, string>;
	}

	let { onQuickResponse, properties, role, propertyImages, propertyLocations }: props = $props();

	// Derived values for role-based UI
	let isAgent = $derived(role === "agent");
	let isUser = $derived(role === "user");

	let property = $derived(properties?.at(0));

	let propertyImage = $derived(() => {
		if (!property?.id || !propertyImages?.[property.id]?.length) {
			return null;
		}
		return propertyImages[property.id][0]; // Use the first image
	});

	let propertyLocation = $derived(() => {
		if (!property?.id || !propertyLocations?.[property.id]) {
			return "Property Location";
		}
		return propertyLocations[property.id];
	});

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
</script>

{#if property}
	<div class="hidden h-full w-80 flex-col gap-4 @7xl:flex">
		<!-- Property Details Card -->
		<Card
			class="flex-1 gap-3 overflow-hidden border-0 py-0 shadow-lg {isAgent
				? 'ring-1 ring-blue-100'
				: 'ring-1 ring-green-100'}"
		>
			<div class="relative flex h-full flex-col">
				<!-- Property Image -->
				{#if propertyImage()}
					<div class="aspect-7/6 w-full overflow-hidden">
						<img
							src={propertyImage()}
							alt={property?.name || "Property"}
							class="h-full w-full object-cover"
						/>
					</div>
				{:else}
					<!-- Property Image Placeholder -->
					<div
						class="h-full bg-gradient-to-br {isAgent
							? 'from-blue-500 to-blue-600'
							: 'from-green-500 to-green-600'}"
					>
						<div class="flex h-full items-center justify-center">
							<Home class="h-8 w-8 text-white/80" />
						</div>
					</div>
				{/if}
				<!-- Role indicator -->
				<div class="absolute top-2 left-2">
					<Badge variant="secondary" class="bg-white/90 text-xs text-gray-600">
						{isAgent ? "Agent View" : "Buyer View"}
					</Badge>
				</div>
				<!-- Property Type Badge -->
				<Badge variant="secondary" class="absolute top-2 right-2 bg-white/90 text-gray-700">
					{propertyType()}
				</Badge>
			</div>

			<CardContent class="p-4">
				<div class="space-y-3">
					<!-- Property Name & Location -->
					<div>
						<h4 class="line-clamp-2 text-sm leading-tight font-semibold text-gray-900">
							{property.name}
						</h4>
						<div class="mt-1 flex items-center gap-1">
							<MapPin class="h-3 w-3 flex-shrink-0 text-gray-400" />
							<p class="truncate text-xs text-gray-500">{propertyLocation()}</p>
						</div>
					</div>

					<!-- Property Details with Icons -->
					{#if details}
						<div class="flex items-center gap-3 text-xs text-gray-600">
							{#if property.bedrooms && property.bedrooms > 0}
								<div class="flex items-center gap-1">
									<Bed class="h-3 w-3" />
									<span>{property.bedrooms}</span>
								</div>
							{/if}
							{#if property.bathrooms && property.bathrooms > 0}
								<div class="flex items-center gap-1">
									<Bath class="h-3 w-3" />
									<span>{property.bathrooms}</span>
								</div>
							{/if}
							{#if property.landArea || property.floorArea}
								<div class="flex items-center gap-1">
									<Ruler class="h-3 w-3" />
									<span>{property.floorArea || property.landArea} sqm</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Price -->
					<div class="flex items-center justify-between">
						<p class="text-lg font-bold text-blue-600">₱{property.price.toLocaleString()}</p>
						<Badge variant="outline" class="text-xs">
							{property.type === "sale"
								? "For Sale"
								: property.type === "rent"
									? "For Rent"
									: "For Lease"}
						</Badge>
					</div>

					<!-- Action Buttons -->
					<div class="flex gap-2 pt-2">
						{#if isAgent}
							<Button variant="default" size="sm" class="h-8 flex-1 text-xs">
								<Eye class="mr-1 h-3 w-3" />
								View
							</Button>
							<Button variant="outline" size="sm" class="h-8 flex-1 text-xs">
								<Calendar class="mr-1 h-3 w-3" />
								Schedule
							</Button>
						{:else}
							<Button
								variant="default"
								size="sm"
								class="h-8 flex-1 bg-green-600 text-xs hover:bg-green-700"
								onclick={() =>
									onQuickResponse(
										"I would like to schedule a viewing for this property. When would be a good time?",
									)}
							>
								<Calendar class="mr-1 h-3 w-3" />
								Book Viewing
							</Button>
							<Button
								variant="outline"
								size="sm"
								class="h-8 flex-1 border-blue-200 text-xs hover:bg-blue-50"
								onclick={() =>
									onQuickResponse("Could you please send me more details about this property?")}
							>
								<FileText class="mr-1 h-3 w-3" />
								Get Info
							</Button>
						{/if}
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Quick Responses Card - Only for Agents -->
		{#if isAgent}
			<Card class="gap-3 border-0 py-0 pt-4 shadow-lg">
				<CardHeader class="pb-0">
					<div class="flex items-center gap-2">
						<MessageSquare class="h-4 w-4 text-blue-600" />
						<CardTitle class="text-sm text-gray-900">Quick Responses</CardTitle>
					</div>
				</CardHeader>
				<CardContent class="space-y-2">
					<!-- Schedule Viewing Response -->
					<Button
						variant="ghost"
						size="sm"
						class="h-auto w-full justify-start border border-transparent p-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50"
						onclick={() =>
							onQuickResponse(
								"Thank you for your interest! I'd be happy to schedule a property viewing for you. When would be the best time for you?",
							)}
					>
						<div class="flex w-full items-start gap-3">
							<div class="mt-0.5 rounded-full bg-blue-100 p-1.5">
								<Calendar class="h-3 w-3 text-blue-600" />
							</div>
							<div class="min-w-0 flex-1 text-xs">
								<div class="font-medium text-gray-900">Schedule Viewing</div>
								<div
									class="mt-0.5 text-xs leading-tight text-gray-500"
									style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
								>
									Thank you for your interest! I'd be happy to schedule a viewing...
								</div>
							</div>
						</div>
					</Button>

					<!-- Send Details Response -->
					<Button
						variant="ghost"
						size="sm"
						class="h-auto w-full justify-start border border-transparent p-3 text-left transition-all hover:border-green-200 hover:bg-green-50"
						onclick={() =>
							onQuickResponse(
								"I'll send you the complete property details, floor plans, and additional photos right away. Please check your messages in a moment.",
							)}
					>
						<div class="flex w-full items-start gap-3">
							<div class="mt-0.5 rounded-full bg-green-100 p-1.5">
								<FileText class="h-3 w-3 text-green-600" />
							</div>
							<div class="min-w-0 flex-1 text-xs">
								<div class="font-medium text-gray-900">Send Details</div>
								<div
									class="mt-0.5 text-xs leading-tight text-gray-500"
									style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
								>
									I'll send you the complete property details and floor plans...
								</div>
							</div>
						</div>
					</Button>

					<!-- Availability Response -->
					<Button
						variant="ghost"
						size="sm"
						class="h-auto w-full justify-start border border-transparent p-3 text-left transition-all hover:border-amber-200 hover:bg-amber-50"
						onclick={() =>
							onQuickResponse(
								"Yes, the property is still available! Would you like to discuss the terms or schedule a viewing? I'm here to help with any questions you might have.",
							)}
					>
						<div class="flex w-full items-start gap-3">
							<div class="mt-0.5 rounded-full bg-amber-100 p-1.5">
								<Send class="h-3 w-3 text-amber-600" />
							</div>
							<div class="min-w-0 flex-1 text-xs">
								<div class="font-medium text-gray-900">Confirm Availability</div>
								<div
									class="mt-0.5 text-xs leading-tight text-gray-500"
									style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
								>
									Yes, the property is still available! Would you like to discuss...
								</div>
							</div>
						</div>
					</Button>

					<!-- Financing Options Response -->
					<Button
						variant="ghost"
						size="sm"
						class="h-auto w-full justify-start border border-transparent p-3 text-left transition-all hover:border-purple-200 hover:bg-purple-50"
						onclick={() =>
							onQuickResponse(
								"I can help you explore financing options for this property. We work with several banks and can assist with loan applications. Would you like me to connect you with our financing specialist?",
							)}
					>
						<div class="flex w-full items-start gap-3">
							<div class="mt-0.5 rounded-full bg-purple-100 p-1.5">
								<FileText class="h-3 w-3 text-purple-600" />
							</div>
							<div class="min-w-0 flex-1 text-xs">
								<div class="font-medium text-gray-900">Financing Options</div>
								<div
									class="mt-0.5 text-xs leading-tight text-gray-500"
									style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
								>
									I can help you explore financing options for this property...
								</div>
							</div>
						</div>
					</Button>
				</CardContent>
			</Card>
		{:else}
			<Card class="h-fit gap-3 border-0 py-4 shadow-lg">
				<CardHeader class="pb-0">
					<div class="flex items-center gap-2">
						<MessageSquare class="h-4 w-4 text-green-600" />
						<CardTitle class="text-sm text-gray-900">Property Actions</CardTitle>
					</div>
				</CardHeader>
				<CardContent class="space-y-3">
					<!-- Express Interest Button -->
					<Button
						variant="default"
						size="sm"
						class="h-auto w-full justify-start bg-green-600 p-3 text-white hover:bg-green-700"
						onclick={() =>
							onQuickResponse(
								"Hi! I'm very interested in this property. Could you please provide more information and schedule a viewing?",
							)}
					>
						<div class="flex w-full items-center gap-3">
							<div class="rounded-full bg-white/20 p-1.5">
								<Eye class="h-4 w-4" />
							</div>
							<div class="text-left">
								<div class="font-medium">Express Interest</div>
								<div class="text-xs text-green-100">Let the agent know you're interested</div>
							</div>
						</div>
					</Button>

					<!-- Ask Questions -->
					<Button
						variant="outline"
						size="sm"
						class="h-auto w-full justify-start border-blue-200 p-3 text-left transition-all hover:bg-blue-50"
						onclick={() =>
							onQuickResponse(
								"I have some questions about this property. Could you tell me more about the neighborhood, amenities, and nearby facilities?",
							)}
					>
						<div class="flex w-full items-start gap-3">
							<div class="mt-0.5 rounded-full bg-blue-100 p-1.5">
								<MessageSquare class="h-3 w-3 text-blue-600" />
							</div>
							<div class="min-w-0 flex-1 text-xs">
								<div class="font-medium text-gray-900">Ask Questions</div>
								<div class="mt-0.5 text-xs text-gray-500">Get more details about the property</div>
							</div>
						</div>
					</Button>

					<!-- Request Virtual Tour -->
					<Button
						variant="outline"
						size="sm"
						class="h-auto w-full justify-start border-purple-200 p-3 text-left transition-all hover:bg-purple-50"
						onclick={() =>
							onQuickResponse(
								"Is a virtual tour or video walkthrough available for this property? I'd love to see more before scheduling an in-person visit.",
							)}
					>
						<div class="flex w-full items-start gap-3">
							<div class="mt-0.5 rounded-full bg-purple-100 p-1.5">
								<Eye class="h-3 w-3 text-purple-600" />
							</div>
							<div class="min-w-0 flex-1 text-xs">
								<div class="font-medium text-gray-900">Virtual Tour</div>
								<div class="mt-0.5 text-xs text-gray-500">Request online viewing options</div>
							</div>
						</div>
					</Button>

					<!-- Price Negotiation -->
					<Button
						variant="outline"
						size="sm"
						class="h-auto w-full justify-start border-amber-200 p-3 text-left transition-all hover:bg-amber-50"
						onclick={() =>
							onQuickResponse(
								"I'm interested in this property. Is there any flexibility with the price? I'd like to discuss the terms and make an offer.",
							)}
					>
						<div class="flex w-full items-start gap-3">
							<div class="mt-0.5 rounded-full bg-amber-100 p-1.5">
								<Send class="h-3 w-3 text-amber-600" />
							</div>
							<div class="min-w-0 flex-1 text-xs">
								<div class="font-medium text-gray-900">Discuss Price</div>
								<div class="mt-0.5 text-xs text-gray-500">Inquire about pricing and terms</div>
							</div>
						</div>
					</Button>
				</CardContent>
			</Card>
		{/if}
	</div>
{/if}

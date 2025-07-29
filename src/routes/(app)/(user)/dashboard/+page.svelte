<script lang="ts">
	import { page } from "$app/stores";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { getDetails, toTitleCase } from "$lib/utils";
	import { Building, Clock, Eye, Heart, MapPin, MessageCircle, Trash2 } from "@lucide/svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	// Tab state for switching between seller and buyer views
	let activeTab = $state<"seller" | "buyer">("seller");

	// Pagination state
	const perPage = 6; // Number of items per page
	let sellerPageNum = $state(1);
	let buyerPageNum = $state(1);

	// Set initial tab based on user type
	$effect(() => {
		if (data.userType?.isSeller) {
			activeTab = "seller";
		} else {
			activeTab = "buyer";
		}
	});

	// Reset pagination when switching tabs
	$effect(() => {
		if (activeTab === "seller") {
			sellerPageNum = 1;
		} else if (activeTab === "buyer") {
			buyerPageNum = 1;
		}
	});

	// Derived values for pagination
	const sellerListings = $derived.by(() => {
		const listings = data.userListings || [];
		const totalPages = Math.ceil(listings.length / perPage);
		const paginatedListings = listings.slice(
			(sellerPageNum - 1) * perPage,
			sellerPageNum * perPage,
		);
		return { listings: paginatedListings, totalPages, totalCount: listings.length };
	});

	const buyerOffers = $derived.by(() => {
		const offers = data.userOffers || [];
		const totalPages = Math.ceil(offers.length / perPage);
		const paginatedOffers = offers.slice((buyerPageNum - 1) * perPage, buyerPageNum * perPage);
		return { offers: paginatedOffers, totalPages, totalCount: offers.length };
	});

	function formatPrice(price: number): string {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 0,
		}).format(price);
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat("en-PH", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	}

	function getStatusColor(status: string): string {
		switch (status.toLowerCase()) {
			case "up":
			case "active":
				return "bg-green-100 text-green-800";
			case "pending":
			case "under-review":
				return "bg-yellow-100 text-yellow-800";
			case "sold":
			case "completed":
				return "bg-blue-100 text-blue-800";
			case "rejected":
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "in negotiation":
				return "bg-purple-100 text-purple-800";
			case "new":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}
</script>

<svelte:head>
	<title>My Dashboard - JuanHomes</title>
</svelte:head>

<div class="mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
	<!-- User Welcome Section -->
	{#if data.user}
		<div
			class="rounded-2xl border bg-gradient-to-r from-slate-50 to-slate-100 p-8 shadow-sm dark:from-slate-900 dark:to-slate-800"
		>
			<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-4">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg"
					>
						{data.user.firstName.charAt(0)}{data.user.lastName.charAt(0)}
					</div>
					<div>
						<h1 class="text-2xl font-bold text-foreground">
							Welcome back, {data.user.firstName}
						</h1>
						<p class="text-muted-foreground">Manage your real estate journey</p>
					</div>
				</div>
				<div class="flex gap-2">
					{#if data.userType?.isSeller}
						<Badge variant="outline" class="px-3 py-1">Seller</Badge>
					{/if}
					{#if data.userType?.isBuyer}
						<Badge variant="outline" class="px-3 py-1">Buyer</Badge>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Success/Error Messages -->
	{#if $page.form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
			<div class="flex items-center">
				<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					></path>
				</svg>
				{$page.form.message || "Operation completed successfully!"}
			</div>
		</div>
	{/if}

	{#if $page.form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
			<div class="flex items-center">
				<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
						clip-rule="evenodd"
					></path>
				</svg>
				{$page.form.error}
			</div>
		</div>
	{/if}

	<!-- Tab Navigation -->
	{#if data.userType?.isSeller && data.userType?.isBuyer}
		<div class="flex items-center justify-center">
			<div class="inline-flex rounded-xl bg-muted p-1 shadow-sm">
				<button
					class="flex cursor-pointer items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 {activeTab ===
					'seller'
						? 'bg-background text-foreground shadow-md'
						: 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
					onclick={() => (activeTab = "seller")}
				>
					<Building class="h-4 w-4" />
					My Listings ({sellerListings.totalCount})
				</button>
				<button
					class="flex cursor-pointer items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 {activeTab ===
					'buyer'
						? 'bg-background text-foreground shadow-md'
						: 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
					onclick={() => (activeTab = "buyer")}
				>
					<Heart class="h-4 w-4" />
					My Offers ({buyerOffers.totalCount})
				</button>
			</div>
		</div>
	{/if}

	<!-- Seller View - Property Listings -->
	{#if (activeTab === "seller" && data.userType?.isSeller) || (!data.userType?.isBuyer && data.userType?.isSeller)}
		<div class="space-y-6">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="text-3xl font-bold tracking-tight">My Properties</h2>
					<p class="text-muted-foreground">Manage and track your property listings</p>
				</div>
				<Button href="/create-listing" class="shadow-sm">
					<Building class="mr-2 h-4 w-4" />
					Add New Listing
				</Button>
			</div>

			{#if !sellerListings.totalCount}
				<div
					class="min-w-4xl rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center"
				>
					<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
						<Building class="h-10 w-10 text-muted-foreground" />
					</div>
					<h3 class="mt-6 text-xl font-semibold">No listings yet</h3>
					<p class="mt-2 text-muted-foreground">
						Start by creating your first property listing to reach potential buyers.
					</p>
					<Button href="/create-listing" class="mt-6">Create Your First Listing</Button>
				</div>
			{:else}
				<div class="space-y-6">
					<!-- Results summary -->
					<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<p class="text-sm text-muted-foreground">
							{sellerListings.totalCount} properties
							{#if sellerListings.totalPages > 1}
								• Page {sellerPageNum} of {sellerListings.totalPages}
							{/if}
						</p>
					</div>

					<div class="grid gap-6">
						{#each sellerListings.listings as property}
							{@const sendMessage = moreEnhance({ reset: false })}
							{@const { enhance, submitting } = sendMessage}
							{@const deleteProperty = moreEnhance({ reset: false })}
							<div
								class="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
							>
								<div class="flex flex-col gap-6 md:flex-row">
									<!-- Property Image -->
									<div class="flex-shrink-0">
										<div class="relative overflow-hidden rounded-xl">
											<img
												src={property.photosUrl?.[0]?.url || "/no-image.jpg"}
												alt={property.name}
												class="h-60 w-full object-cover transition-transform duration-200 group-hover:scale-105 md:size-53"
											/>
										</div>
									</div>

									<!-- Property Details -->
									<div class="flex-1 space-y-4">
										<div class="flex items-start justify-between">
											<div class="space-y-2">
												<h3 class="text-xl font-semibold">{property.name}</h3>
												<div class="flex items-center gap-2 text-muted-foreground">
													<MapPin class="h-4 w-4" />
													<span class="text-sm"
														>{property.address.barangay}, {property.address.city}</span
													>
												</div>
											</div>
											<Badge
												class="{getStatusColor(
													property.listing?.status || '',
												)} border-0 font-medium"
											>
												{toTitleCase(property.listing?.status || "")}
											</Badge>
										</div>

										<div class="flex flex-wrap items-center gap-6 text-sm">
											<div class="flex items-center gap-2 font-semibold text-foreground">
												{formatPrice(property.price)}
											</div>
											<div class="flex items-center gap-2 text-muted-foreground">
												<Clock class="h-4 w-4" />
												Listed {formatDate(property.listing?.dateCreated || new Date())}
											</div>
										</div>

										{#if property.description}
											<p class="line-clamp-2 text-sm text-muted-foreground">
												{property.description}
											</p>
										{/if}

										<!-- Property Features -->
										<p class="text-sm text-muted-foreground">
											{getDetails(property)}
										</p>
									</div>

									<!-- Action Buttons -->
									<div class="flex flex-col gap-3 lg:items-end">
										<Button
											variant="outline"
											size="sm"
											href="/listings/{property.id}"
											class="flex w-full justify-start"
										>
											<Eye class="mr-2 h-4 w-4" />
											View Details
										</Button>
										<form method="POST" action="?/sendMessage" use:enhance>
											<input type="hidden" name="agentId" value={property.listing?.agentId} />
											<input type="hidden" name="listingId" value={property.listing?.id} />
											<Button
												variant="outline"
												size="sm"
												type="submit"
												class="flex w-full justify-start"
												disabled={submitting}
											>
												<MessageCircle class="mr-2 h-4 w-4" />
												Send Message
											</Button>
										</form>
										<form method="POST" action="?/deleteListing" use:deleteProperty.enhance>
											<input type="hidden" name="propertyId" value={property.id} />
											<Button
												variant="ghost"
												size="sm"
												type="submit"
												class="flex w-full text-red-600 hover:bg-red-50 hover:text-red-700"
												disabled={deleteProperty.submitting}
												onclick={(e) => {
													if (
														!confirm(
															"Are you sure you want to delete this property? This action cannot be undone.",
														)
													) {
														e.preventDefault();
													}
												}}
											>
												<Trash2 class="mr-2 h-4 w-4" />
												{deleteProperty.submitting ? "Deleting..." : "Delete"}
											</Button>
										</form>

										<!-- Agent Info -->
										{#if property.listing?.agent}
											<Button
												href="/agents/{property.listing.agentId}"
												variant="outline"
												class="my-4 flex w-full justify-end border-none"
											>
												<div class="min-w-0 flex-1">
													<p class="text-sm font-medium text-foreground">
														{property.listing.agent.user.firstName}
														{property.listing.agent.user.lastName}
													</p>
													{#if property.listing.agent.user.mobileNumber}
														<p class="text-xs text-muted-foreground">
															{property.listing.agent.user.mobileNumber}
														</p>
													{/if}
												</div>
											</Button>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- Pagination for Seller Listings -->
					{#if sellerListings.totalPages > 1}
						<div
							class="mt-8 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:mt-12 sm:pt-8"
						>
							<div class="flex items-center gap-2 sm:gap-4">
								<Button
									variant="outline"
									size="sm"
									disabled={sellerPageNum <= 1}
									onclick={() => (sellerPageNum = Math.max(1, sellerPageNum - 1))}
									class="px-3 py-2 text-sm"
								>
									<span class="hidden sm:inline">Previous</span>
									<span class="sm:hidden">Prev</span>
								</Button>

								<div class="flex items-center gap-1 sm:gap-2">
									{#if sellerListings.totalPages <= 7}
										{#each Array(sellerListings.totalPages) as _, i}
											<Button
												variant={sellerPageNum === i + 1 ? "default" : "outline"}
												size="sm"
												class="h-8 w-8 p-0 text-sm sm:h-10 sm:w-10"
												onclick={() => (sellerPageNum = i + 1)}
											>
												{i + 1}
											</Button>
										{/each}
									{:else}
										<!-- Show simplified pagination for many pages -->
										<span class="px-2 py-2 text-xs text-muted-foreground sm:px-3 sm:text-sm">
											Page {sellerPageNum} of {sellerListings.totalPages}
										</span>
									{/if}
								</div>

								<Button
									variant="outline"
									size="sm"
									disabled={sellerPageNum >= sellerListings.totalPages}
									onclick={() =>
										(sellerPageNum = Math.min(sellerListings.totalPages, sellerPageNum + 1))}
									class="px-3 py-2 text-sm"
								>
									<span class="hidden sm:inline">Next</span>
									<span class="sm:hidden">Next</span>
								</Button>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Buyer View - Offers Made -->
	{#if (activeTab === "buyer" && data.userType?.isBuyer) || (!data.userType?.isSeller && data.userType?.isBuyer)}
		<div class="w-full space-y-6">
			<div class="ga-4 flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
				<div class="w-full">
					<h2 class="text-3xl font-bold tracking-tight">My Offers</h2>
					<p class="text-muted-foreground">Track your property offers and negotiations</p>
				</div>
				<Button href="/listings" class="mt-3 shadow-sm sm:mt-0">
					<Heart class="mr-2 h-4 w-4 " />
					Browse Properties
				</Button>
			</div>

			{#if !buyerOffers.totalCount}
				<div
					class="rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center"
				>
					<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
						<Heart class="h-10 w-10 text-muted-foreground" />
					</div>
					<h3 class="mt-6 text-xl font-semibold">No offers yet</h3>
					<p class="mt-2 text-muted-foreground">
						Browse our property listings and make your first offer on a property you love.
					</p>
					<Button href="/listings" class="mt-6">Browse Properties</Button>
				</div>
			{:else}
				<div class="space-y-6">
					<!-- Results summary -->
					<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<p class="text-sm text-muted-foreground">
							{buyerOffers.totalCount} offers
							{#if buyerOffers.totalPages > 1}
								• Page {buyerPageNum} of {buyerOffers.totalPages}
							{/if}
						</p>
					</div>

					<div class="grid gap-6">
						{#each buyerOffers.offers as offer}
							{@const sendMessage = moreEnhance({ reset: false })}
							{@const { enhance, submitting } = sendMessage}
							<div
								class="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
							>
								<div class="flex flex-col gap-6 md:flex-row">
									<!-- Property Image -->
									<div class="flex-shrink-0">
										<div class="relative overflow-hidden rounded-xl">
											<img
												src={offer.listing.property.photosUrl?.[0]?.url || "/no-image.jpg"}
												alt={offer.listing.property.name}
												class="h-60 w-full object-cover transition-transform duration-200 group-hover:scale-105 md:h-40 md:w-40 lg:h-32 lg:w-32"
											/>
										</div>
									</div>

									<!-- Property Details -->
									<div class="flex-1 space-y-4">
										<div class="flex items-start justify-between gap-3">
											<div class="space-y-2">
												<h3 class="line-clamp-2 text-xl font-semibold lg:line-clamp-1">
													{offer.listing.property.name}
												</h3>
												<div class="flex items-center gap-2 text-muted-foreground">
													<MapPin class="h-4 w-4" />
													<span class="text-sm">
														{offer.listing.property.address.barangay},
														{offer.listing.property.address.city},
														{offer.listing.property.address.province}
													</span>
												</div>
											</div>
											<Badge class="{getStatusColor(offer.listing.status)} border-0 font-medium">
												{toTitleCase(offer.listing.status)}
											</Badge>
										</div>

										<div class="flex flex-wrap items-center gap-6 text-sm">
											<div class="flex items-center gap-2 font-semibold text-foreground">
												{formatPrice(offer.listing.property.price)}
											</div>
											<div class="flex items-center gap-2 text-muted-foreground">
												<Clock class="h-4 w-4" />
												Offered {formatDate(offer.dateCreated)}
											</div>
										</div>

										<!-- Property Features -->
										<p class="text-sm text-muted-foreground">
											{getDetails(offer.listing.property)}
										</p>
									</div>

									<!-- Action Buttons -->
									<div class="flex flex-col gap-3 lg:items-end">
										<Button
											variant="outline"
											size="sm"
											href="/listings/{offer.listing.id}"
											class="w-full "
										>
											<Eye class="mr-2 h-4 w-4" />
											View Property
										</Button>
										<form method="POST" action="?/sendMessage" use:enhance>
											<input type="hidden" name="agentId" value={offer.listing.agentId} />
											<input type="hidden" name="listingId" value={offer.listing.id} />
											<Button
												variant="outline"
												size="sm"
												type="submit"
												class="w-full"
												disabled={submitting}
											>
												<MessageCircle class="mr-2 h-4 w-4" />
												Send Message
											</Button>
										</form>

										{#if offer.status === "new" || offer.status === "in negotiation"}
											<Button
												variant="ghost"
												size="sm"
												class="w-full text-red-600 hover:bg-red-50 hover:text-red-700 "
											>
												<Trash2 class="mr-2 h-4 w-4" />
												Withdraw Offer
											</Button>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- Pagination for Buyer Offers -->
					{#if buyerOffers.totalPages > 1}
						<div
							class="mt-8 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:mt-12 sm:pt-8"
						>
							<div class="flex items-center gap-2 sm:gap-4">
								<Button
									variant="outline"
									size="sm"
									disabled={buyerPageNum <= 1}
									onclick={() => (buyerPageNum = Math.max(1, buyerPageNum - 1))}
									class="px-3 py-2 text-sm"
								>
									<span class="hidden sm:inline">Previous</span>
									<span class="sm:hidden">Prev</span>
								</Button>

								<div class="flex items-center gap-1 sm:gap-2">
									{#if buyerOffers.totalPages <= 7}
										{#each Array(buyerOffers.totalPages) as _, i}
											<Button
												variant={buyerPageNum === i + 1 ? "default" : "outline"}
												size="sm"
												class="h-8 w-8 p-0 text-sm sm:h-10 sm:w-10"
												onclick={() => (buyerPageNum = i + 1)}
											>
												{i + 1}
											</Button>
										{/each}
									{:else}
										<!-- Show simplified pagination for many pages -->
										<span class="px-2 py-2 text-xs text-muted-foreground sm:px-3 sm:text-sm">
											Page {buyerPageNum} of {buyerOffers.totalPages}
										</span>
									{/if}
								</div>

								<Button
									variant="outline"
									size="sm"
									disabled={buyerPageNum >= buyerOffers.totalPages}
									onclick={() =>
										(buyerPageNum = Math.min(buyerOffers.totalPages, buyerPageNum + 1))}
									class="px-3 py-2 text-sm"
								>
									<span class="hidden sm:inline">Next</span>
									<span class="sm:hidden">Next</span>
								</Button>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- No access message -->
	{#if !data.userType?.isSeller && !data.userType?.isBuyer}
		<div
			class="rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center"
		>
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
				<Building class="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 class="mt-6 text-xl font-semibold">Welcome to JuanHomes</h3>
			<p class="mt-2 text-muted-foreground">
				To access your dashboard, you'll need to either list a property or make an offer on one.
			</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
				<Button href="/listings" class="w-full sm:w-auto">Browse Properties</Button>
				<Button variant="outline" href="/create-listing" class="w-full sm:w-auto">
					List Property
				</Button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Smooth transitions for interactive elements */
	.group:hover .group-hover\:scale-105 {
		transform: scale(1.05);
	}

	/* Custom gradient backgrounds */
	.bg-gradient-to-r {
		background-image: linear-gradient(to right, var(--tw-gradient-stops));
	}
</style>

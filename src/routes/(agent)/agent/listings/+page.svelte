<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { getDetails, toTitleCase } from "$lib/utils";
	import {
		AlertCircle,
		Building,
		CheckCircle,
		ChevronDown,
		ChevronUp,
		Clock,
		Edit,
		Eye,
		Filter,
		MapPin,
		MessageCircle,
		RotateCcw,
		User,
	} from "@lucide/svelte";

	let { data } = $props();

	// Filter and sort state
	let statusFilter = $state("All Status");
	let sortBy = $state("Newest First");

	// Mobile filter visibility toggle
	let showFilters = $state(false);

	// Pagination state
	const perPage = 6; // Number of items per page
	let pageNum = $state(1);

	// Derived values for filtering, sorting, and pagination
	const paginatedListings = $derived.by(() => {
		const listings = data.listings || [];

		// Apply filters
		const filteredListings = listings.filter((listing) => {
			const matchesStatus =
				statusFilter === "All Status" || toTitleCase(listing.status) === statusFilter;
			return matchesStatus;
		});

		// Apply sorting
		const sortedListings = filteredListings.sort((a, b) => {
			switch (sortBy) {
				case "Newest First":
					return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
				case "Oldest First":
					return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
				case "Highest Price":
					return b.property.price - a.property.price;
				case "Lowest Price":
					return a.property.price - b.property.price;
				case "Status":
					return a.status.localeCompare(b.status);
				default:
					return 0;
			}
		});

		const totalPages = Math.ceil(sortedListings.length / perPage);
		const paginatedData = sortedListings.slice((pageNum - 1) * perPage, pageNum * perPage);
		return { listings: paginatedData, totalPages, totalCount: sortedListings.length };
	});

	// Reset filters
	function resetFilters() {
		statusFilter = "All Status";
		sortBy = "Newest First";
		pageNum = 1;
	}

	// Reset to page 1 when filters change
	$effect(() => {
		// Track filter changes
		statusFilter;
		sortBy;
		// Reset to page 1 when any filter changes
		pageNum = 1;
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
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "sold":
				return "bg-blue-100 text-blue-800";
			case "under-review":
				return "bg-purple-100 text-purple-800";
			case "submitted":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	function getStatusIcon(status: string) {
		switch (status.toLowerCase()) {
			case "up":
				return CheckCircle;
			case "sold":
				return CheckCircle;
			case "pending":
			case "under-review":
				return AlertCircle;
			case "submitted":
				return Clock;
			default:
				return AlertCircle;
		}
	}
</script>

<svelte:head>
	<title>My Listings - JuanHomes Agent</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-4 px-2 py-4 sm:px-4 lg:px-6">
	<!-- Header Section -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Property Listings</h2>
			<p class="text-muted-foreground">Manage and track your property submissions</p>
		</div>
		<Button href="/agent/leads" class="shadow-sm">
			<Building class="mr-2 h-4 w-4" />
			View Active Leads
		</Button>
	</div>

	<!-- Filter and Sort Controls -->
	<div class="mb-6 rounded-xl border bg-card p-3 shadow-sm">
		<!-- Mobile: Stacked layout -->
		<div class="flex flex-col gap-3 lg:hidden">
			<!-- Mobile Filter Toggle Button -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium">
						{paginatedListings.totalCount} listing{paginatedListings.totalCount !== 1 ? "s" : ""}
					</span>
				</div>
				<Button
					variant="outline"
					size="sm"
					class="flex items-center gap-2"
					onclick={() => (showFilters = !showFilters)}
				>
					<Filter class="h-4 w-4" />
					<span class="hidden sm:inline">Filters</span>
					{#if showFilters}
						<ChevronUp class="h-4 w-4" />
					{:else}
						<ChevronDown class="h-4 w-4" />
					{/if}
				</Button>
			</div>

			<!-- Collapsible Filters -->
			{#if showFilters}
				<div class="flex flex-col gap-3">
					<!-- Filter Row 1 -->
					<div class="flex flex-wrap items-center gap-2">
						<!-- Status Filter -->
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium">Status:</span>
							<Select.Root type="single" bind:value={statusFilter}>
								<Select.Trigger class="w-full min-w-32 sm:w-40">
									<span>{statusFilter}</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Item value="All Status">All Status</Select.Item>
										<Select.Item value="Submitted">Submitted</Select.Item>
										<Select.Item value="Under Review">Under Review</Select.Item>
										<Select.Item value="Up">Active</Select.Item>
										<Select.Item value="Pending">Pending</Select.Item>
										<Select.Item value="Sold">Sold</Select.Item>
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>

						<!-- Sort By -->
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium">Sort:</span>
							<Select.Root type="single" bind:value={sortBy}>
								<Select.Trigger class="w-full min-w-32 sm:w-36">
									<span>{sortBy}</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Item value="Newest First">Newest First</Select.Item>
										<Select.Item value="Oldest First">Oldest First</Select.Item>
										<Select.Item value="Highest Price">Highest Price</Select.Item>
										<Select.Item value="Lowest Price">Lowest Price</Select.Item>
										<Select.Item value="Status">Status</Select.Item>
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>

						<!-- Reset Filters Button -->
						<Button
							variant="outline"
							size="sm"
							onclick={resetFilters}
							class="flex items-center gap-2"
						>
							<RotateCcw class="h-4 w-4" />
							<span class="hidden sm:inline">Reset</span>
						</Button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Desktop: Single row layout -->
		<div class="hidden items-center gap-2 lg:flex lg:justify-between">
			<div class="flex items-center gap-4">
				<!-- Status Filter -->
				<div class="flex items-center gap-2">
					<Filter class="h-4 w-4 text-muted-foreground" />
					<span class="text-sm font-medium">Filter:</span>
					<Select.Root type="single" bind:value={statusFilter}>
						<Select.Trigger class="w-full min-w-32 sm:w-40">
							<span>{statusFilter}</span>
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Item value="All Status">All Status</Select.Item>
								<Select.Item value="Submitted">Submitted</Select.Item>
								<Select.Item value="Under Review">Under Review</Select.Item>
								<Select.Item value="Up">Active</Select.Item>
								<Select.Item value="Pending">Pending</Select.Item>
								<Select.Item value="Sold">Sold</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Sort By -->
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium">Sort:</span>
					<Select.Root type="single" bind:value={sortBy}>
						<Select.Trigger class="w-full min-w-32 sm:w-36">
							<span>{sortBy}</span>
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Item value="Newest First">Newest First</Select.Item>
								<Select.Item value="Oldest First">Oldest First</Select.Item>
								<Select.Item value="Highest Price">Highest Price</Select.Item>
								<Select.Item value="Lowest Price">Lowest Price</Select.Item>
								<Select.Item value="Status">Status</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<!-- Reset Filters Button -->
			<Button variant="outline" size="sm" onclick={resetFilters} class="flex items-center gap-2">
				<RotateCcw class="h-4 w-4" />
				Reset
			</Button>
		</div>
	</div>

	{#if !data.listings?.length}
		<div
			class="rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center"
		>
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
				<Building class="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 class="mt-6 text-xl font-semibold">No listings yet</h3>
			<p class="mt-2 text-muted-foreground">
				Your property submissions from sellers will appear here once they're submitted.
			</p>
		</div>
	{:else if !paginatedListings.totalCount}
		<div
			class="rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center"
		>
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
				<Filter class="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 class="mt-6 text-xl font-semibold">No listings match your filters</h3>
			<p class="mt-2 text-muted-foreground">Try adjusting your filters to see more results.</p>
			<Button variant="outline" onclick={resetFilters} class="mt-6">
				<RotateCcw class="mr-2 h-4 w-4" />
				Reset Filters
			</Button>
		</div>
	{:else}
		<div class="space-y-6">
			<!-- Results summary - Only show on desktop -->
			<div class="hidden flex-col gap-2 sm:flex-row sm:items-center sm:justify-between lg:flex">
				<p class="text-sm text-muted-foreground">
					{paginatedListings.totalCount} listing{paginatedListings.totalCount !== 1 ? "s" : ""}
					{#if statusFilter !== "All Status"}
						• Filtered by {statusFilter}
					{/if}
					{#if sortBy !== "Newest First"}
						• Sorted by {sortBy}
					{/if}
					{#if paginatedListings.totalPages > 1}
						• Page {pageNum} of {paginatedListings.totalPages}
					{/if}
				</p>
			</div>

			<div class="grid gap-6">
				{#each paginatedListings.listings as listing}
					{@const sendMessage = moreEnhance({ reset: false })}
					{@const updateStatus = moreEnhance({ reset: false })}
					{@const { enhance: enhanceMessage, submitting: submittingMessage } = sendMessage}
					{@const { enhance: enhanceStatus, submitting: submittingStatus } = updateStatus}
					{@const StatusIcon = getStatusIcon(listing.status)}
					<div
						class="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
					>
						<div class="flex flex-col gap-3 md:flex-row">
							<!-- Property Image -->
							<div class="flex-shrink-0">
								<div class="relative overflow-hidden rounded-xl">
									<img
										src={listing.property.photosUrl?.[0]?.url || "/no-image.jpg"}
										alt={listing.property.name}
										class="h-60 w-full object-cover transition-transform duration-200 group-hover:scale-105 md:size-53"
									/>
									<!-- Offer count overlay -->
									{#if listing.offers?.length > 0}
										<div
											class="absolute top-2 right-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-lg"
										>
											{listing.offers.length} offer{listing.offers.length !== 1 ? "s" : ""}
										</div>
									{/if}
								</div>
							</div>

							<!-- Listing Details -->
							<div class="flex-1 space-y-4">
								<div class="flex items-start justify-between gap-2">
									<div class="space-y-2">
										<h3 class="line-clamp-2 text-xl font-semibold">{listing.property.name}</h3>
										<div class="flex items-center gap-2 text-muted-foreground">
											<MapPin class="h-4 w-4" />
											<span class="text-sm">
												{listing.property.address.barangay},
												{listing.property.address.city}
											</span>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<StatusIcon class="h-4 w-4" />
										<Badge class="{getStatusColor(listing.status)} border-0 font-medium">
											{toTitleCase(listing.status === "up" ? "active" : listing.status)}
										</Badge>
									</div>
								</div>

								<div class="flex flex-wrap items-center gap-3 text-sm">
									<div class="flex items-center gap-2 font-semibold text-foreground">
										{formatPrice(listing.property.price)}
									</div>
									<div class="flex items-center gap-2 text-muted-foreground">
										<Clock class="h-4 w-4" />
										Submitted {formatDate(listing.dateCreated)}
									</div>
								</div>

								<!-- Property Features -->
								<p class="text-sm text-muted-foreground">
									{getDetails(listing.property)}
								</p>

								<!-- Seller Info -->
								<div class="flex w-full">
									{#if listing.seller}
										<div class="flex items-center gap-2 rounded-lg bg-muted/80 p-3 text-sm">
											<User class="h-4 w-4 text-primary" />
											<span class="font-medium text-foreground">
												{listing.seller.user.firstName}
												{listing.seller.user.lastName}
											</span>
											{#if listing.seller.user.mobileNumber}
												<span class="text-muted-foreground"
													>• {listing.seller.user.mobileNumber}</span
												>
											{/if}
										</div>
									{/if}
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="flex flex-col justify-between gap-3 lg:items-end">
								<div class="flex flex-col gap-3">
									<Button
										variant="outline"
										size="sm"
										href="/listings/{listing.id}"
										class="flex w-full justify-start"
									>
										<Eye class="mr-2 h-4 w-4" />
										View Property
									</Button>
									{#if listing.seller}
										<form method="POST" action="?/sendMessage" class="w-full" use:enhanceMessage>
											<input type="hidden" name="sellerId" value={listing.seller.id} />
											<input type="hidden" name="listingId" value={listing.id} />
											<Button
												variant="outline"
												size="sm"
												type="submit"
												class="flex w-full justify-start"
												disabled={submittingMessage}
											>
												<MessageCircle class="mr-2 h-4 w-4" />
												Contact Seller
											</Button>
										</form>
									{/if}
								</div>

								<!-- Status Actions -->
								{#if listing.status === "submitted" || listing.status === "under-review"}
									<div class="mt-5 flex w-full flex-row gap-2 md:flex-col">
										<form method="POST" action="?/updateStatus" use:enhanceStatus>
											<input type="hidden" name="listingId" value={listing.id} />
											<input type="hidden" name="status" value="up" />
											<Button
												variant="default"
												size="sm"
												type="submit"
												class="flex-1 bg-green-600 hover:bg-green-700 md:w-full md:flex-none"
												disabled={submittingStatus}
											>
												Approve
											</Button>
										</form>
										<form method="POST" action="?/updateStatus" use:enhanceStatus>
											<input type="hidden" name="listingId" value={listing.id} />
											<input type="hidden" name="status" value="under-review" />
											<Button
												variant="outline"
												size="sm"
												type="submit"
												class="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 md:w-full md:flex-none"
												disabled={submittingStatus}
											>
												{listing.status === "submitted" ? "Review" : "Reject"}
											</Button>
										</form>
									</div>
								{:else if listing.status === "up"}
									<div class="mt-5 flex w-full flex-row gap-2 md:flex-col">
										<!-- <form method="POST" action="?/updateStatus" use:enhanceStatus>
											<input type="hidden" name="listingId" value={listing.id} />
											<input type="hidden" name="status" value="sold" />
											<Button
												variant="default"
												size="sm"
												type="submit"
												class="flex-1 bg-blue-600 hover:bg-blue-700 md:w-full md:flex-none"
												disabled={submittingStatus}
											>
												Mark as Sold
											</Button>
										</form> -->
										<Button
											variant="outline"
											size="sm"
											href="/agent/listings/edit/{listing.id}"
											class="flex-1 md:w-full md:flex-none"
										>
											<Edit class="mr-2 h-4 w-4" />
											Edit
										</Button>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if paginatedListings.totalPages > 1}
				<div
					class="mt-8 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:mt-12 sm:pt-8"
				>
					<div class="flex items-center gap-2 sm:gap-4">
						<Button
							variant="outline"
							size="sm"
							disabled={pageNum <= 1}
							onclick={() => (pageNum = Math.max(1, pageNum - 1))}
							class="px-3 py-2 text-sm"
						>
							<span class="hidden sm:inline">Previous</span>
							<span class="sm:hidden">Prev</span>
						</Button>

						<div class="flex items-center gap-1 sm:gap-2">
							{#if paginatedListings.totalPages <= 7}
								{#each Array(paginatedListings.totalPages) as _, i}
									<Button
										variant={pageNum === i + 1 ? "default" : "outline"}
										size="sm"
										class="h-8 w-8 p-0 text-sm sm:h-10 sm:w-10"
										onclick={() => (pageNum = i + 1)}
									>
										{i + 1}
									</Button>
								{/each}
							{:else}
								<!-- Show simplified pagination for many pages -->
								<span class="px-2 py-2 text-xs text-muted-foreground sm:px-3 sm:text-sm">
									Page {pageNum} of {paginatedListings.totalPages}
								</span>
							{/if}
						</div>

						<Button
							variant="outline"
							size="sm"
							disabled={pageNum >= paginatedListings.totalPages}
							onclick={() => (pageNum = Math.min(paginatedListings.totalPages, pageNum + 1))}
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

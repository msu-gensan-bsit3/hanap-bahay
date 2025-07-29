<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Select from "$lib/components/ui/select";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { getDetails, toTitleCase } from "$lib/utils";
	import {
		Check,
		ChevronDown,
		ChevronUp,
		Clock,
		Eye,
		Filter,
		Heart,
		MapPin,
		MessageCircle,
		RotateCcw,
		User,
		X,
	} from "@lucide/svelte";

	let { data, form } = $props();

	// Filter and sort state
	let statusFilter = $state("All Status");
	let sortBy = $state("Newest First");

	// Mobile filter visibility toggle
	let showFilters = $state(false);

	// Pagination state
	const perPage = 6; // Number of items per page
	let pageNum = $state(1);

	// Dialog state
	let showMarkAsSoldDialog = $state(false);
	let showDeclineDialog = $state(false);
	let selectedLeadId = $state("");
	let selectedBuyerName = $state("");
	let selectedPropertyName = $state("");

	// Enhanced form actions for dialogs
	const markAsSoldEnhance = moreEnhance({
		reset: false,
		onSubmit: () => {
			showMarkAsSoldDialog = false;
		},
	});

	const declineEnhance = moreEnhance({
		reset: false,
		onSubmit: () => {
			showDeclineDialog = false;
		},
	});

	// Derived values for filtering, sorting, and pagination
	const paginatedLeads = $derived.by(() => {
		const leads = data.leads || [];

		// Apply filters
		const filteredLeads = leads.filter((lead) => {
			const matchesStatus =
				statusFilter === "All Status" || toTitleCase(lead.status) === statusFilter;
			return matchesStatus;
		});

		// Apply sorting
		const sortedLeads = filteredLeads.sort((a, b) => {
			switch (sortBy) {
				case "Newest First":
					return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
				case "Oldest First":
					return new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
				case "Highest Price":
					return b.listing.property.price - a.listing.property.price;
				case "Lowest Price":
					return a.listing.property.price - b.listing.property.price;
				case "Status":
					return a.status.localeCompare(b.status);
				default:
					return 0;
			}
		});

		const totalPages = Math.ceil(sortedLeads.length / perPage);
		const paginatedData = sortedLeads.slice((pageNum - 1) * perPage, pageNum * perPage);
		return { leads: paginatedData, totalPages, totalCount: sortedLeads.length };
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
			case "completed":
				return "bg-green-100 text-green-800";
			case "in negotiation":
				return "bg-purple-100 text-purple-800";
			case "new":
				return "bg-orange-100 text-orange-800";
			case "rejected":
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "pending":
			case "under-review":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	}

	// Dialog helper functions
	function openMarkAsSoldDialog(leadId: number, buyerName: string, propertyName: string) {
		selectedLeadId = String(leadId);
		selectedBuyerName = buyerName;
		selectedPropertyName = propertyName;
		showMarkAsSoldDialog = true;
	}

	function openDeclineDialog(leadId: number, buyerName: string, propertyName: string) {
		selectedLeadId = String(leadId);
		selectedBuyerName = buyerName;
		selectedPropertyName = propertyName;
		showDeclineDialog = true;
	}
</script>

<svelte:head>
	<title>My Leads - JuanHomes Agent</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-4 px-2 py-4 sm:px-4 lg:px-6">
	<!-- Success/Error Messages -->
	{#if form?.success}
		<div
			class="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-900/10 dark:text-green-400"
		>
			<p class="font-medium">{form.message}</p>
		</div>
	{/if}

	{#if form?.err}
		<div
			class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/10 dark:text-red-400"
		>
			<p class="font-medium">{form.err}</p>
		</div>
	{/if}
	<!-- Agent Welcome Section -->
	<!-- <div
		class="rounded-2xl border bg-gradient-to-r from-slate-50 to-slate-100 p-8 shadow-sm dark:from-slate-900 dark:to-slate-800"
	>
		<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-4">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg"
				>
					<UserCheck class="h-8 w-8" />
				</div>
				<div>
					<h1 class="text-2xl font-bold text-foreground">Buyer Interest & Leads</h1>
					<p class="text-muted-foreground">Manage offers from interested buyers</p>
				</div>
			</div>
			<div class="flex gap-2">
				<Badge variant="outline" class="px-3 py-1">
					{paginatedLeads.totalCount} Lead{paginatedLeads.totalCount !== 1 ? "s" : ""}
				</Badge>
			</div>
		</div>
	</div> -->

	<!-- Header Section -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Active Leads</h2>
			<p class="text-muted-foreground">Track and manage buyer offers on your listings</p>
		</div>
		<Button href="/agent/listings" class="shadow-sm">
			<Heart class="mr-2 h-4 w-4" />
			View My Listings
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
						{paginatedLeads.totalCount} lead{paginatedLeads.totalCount !== 1 ? "s" : ""}
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
										<Select.Item value="New">New</Select.Item>
										<Select.Item value="In Negotiation">In Negotiation</Select.Item>
										<Select.Item value="Completed">Completed</Select.Item>
										<Select.Item value="Rejected">Rejected</Select.Item>
										<Select.Item value="Cancelled">Cancelled</Select.Item>
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
								<Select.Item value="New">New</Select.Item>
								<Select.Item value="In Negotiation">In Negotiation</Select.Item>
								<Select.Item value="Completed">Completed</Select.Item>
								<Select.Item value="Rejected">Rejected</Select.Item>
								<Select.Item value="Cancelled">Cancelled</Select.Item>
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

	{#if !data.leads?.length}
		<div
			class="rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center"
		>
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
				<Heart class="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 class="mt-6 text-xl font-semibold">No leads yet</h3>
			<p class="mt-2 text-muted-foreground">
				When buyers show interest in your listings, their offers will appear here.
			</p>
			<Button href="/agent/listings" class="mt-6">View My Listings</Button>
		</div>
	{:else if !paginatedLeads.totalCount}
		<div
			class="rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center"
		>
			<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
				<Filter class="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 class="mt-6 text-xl font-semibold">No leads match your filters</h3>
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
					{paginatedLeads.totalCount} lead{paginatedLeads.totalCount !== 1 ? "s" : ""}
					{#if statusFilter !== "All Status"}
						• Filtered by {statusFilter}
					{/if}
					{#if sortBy !== "Newest First"}
						• Sorted by {sortBy}
					{/if}
					{#if paginatedLeads.totalPages > 1}
						• Page {pageNum} of {paginatedLeads.totalPages}
					{/if}
				</p>
			</div>

			<div class="grid gap-6">
				{#each paginatedLeads.leads as lead}
					{@const sendMessage = moreEnhance({ reset: false })}
					{@const { enhance, submitting } = sendMessage}
					<div
						class="group rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
					>
						<div class="flex flex-col gap-3 md:flex-row">
							<!-- Property Image -->
							<div class="flex-shrink-0">
								<div class="relative overflow-hidden rounded-xl">
									<img
										src={lead.listing.property.photosUrl?.[0]?.url || "/no-image.jpg"}
										alt={lead.listing.property.name}
										class="h-60 w-full object-cover transition-transform duration-200 group-hover:scale-105 md:size-53"
									/>
								</div>
							</div>

							<!-- Lead Details -->
							<div class="flex-1 space-y-4">
								<div class="flex items-start justify-between gap-2">
									<div class="space-y-2">
										<h3 class="line-clamp-2 text-xl font-semibold">{lead.listing.property.name}</h3>
										<div class="flex items-center gap-2 text-muted-foreground">
											<MapPin class="h-4 w-4" />
											<span class="text-sm">
												{lead.listing.property.address.barangay},
												{lead.listing.property.address.city}
											</span>
										</div>
									</div>
									<Badge class="{getStatusColor(lead.status)} border-0 font-medium">
										{toTitleCase(lead.status)}
									</Badge>
								</div>

								<div class="flex flex-wrap items-center gap-3 text-sm">
									<div class="flex items-center gap-2 font-semibold text-foreground">
										{formatPrice(lead.listing.property.price)}
									</div>
									<div class="flex items-center gap-2 text-muted-foreground">
										<Clock class="h-4 w-4" />
										Offer made {formatDate(lead.dateCreated)}
									</div>
								</div>

								<!-- Property Features -->
								<p class="text-sm text-muted-foreground">
									{getDetails(lead.listing.property)}
								</p>

								<!-- Buyer Info -->
								<div class="flex w-full">
									<div class="flex items-center gap-2 rounded-lg bg-muted/80 p-3 text-sm md:mt-6">
										<User class="h-4 w-4 text-primary" />
										<span class="font-medium text-foreground">
											{lead.buyer.user.firstName}
											{lead.buyer.user.lastName}
										</span>
										{#if lead.buyer.user.mobileNumber}
											<span class="text-muted-foreground">• {lead.buyer.user.mobileNumber}</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="flex flex-col justify-between gap-3 lg:items-end">
								<div class="flex flex-col gap-3">
									<Button
										variant="outline"
										size="sm"
										href="/listings/{lead.listing.property.id}"
										class="flex w-full justify-start"
									>
										<Eye class="mr-2 h-4 w-4" />
										View Property
									</Button>
									<form method="POST" action="?/sendMessage" class="w-full" use:enhance>
										<input type="hidden" name="buyerId" value={lead.buyer.user.id} />
										<input type="hidden" name="listingId" value={lead.listing.id} />
										<Button
											variant="outline"
											size="sm"
											type="submit"
											class="flex w-full justify-start"
											disabled={submitting}
										>
											<MessageCircle class="mr-2 h-4 w-4" />
											Contact Buyer
										</Button>
									</form>
								</div>

								{#if lead.status === "new"}
									<div class="mt-5 flex w-full flex-row gap-2 md:flex-col">
										<Button
											variant="default"
											size="sm"
											class="flex-1 bg-green-600 hover:bg-green-700 md:flex-none"
											disabled={Number(selectedLeadId) === lead.id && markAsSoldEnhance.submitting}
											onclick={() =>
												openMarkAsSoldDialog(
													lead.id,
													`${lead.buyer.user.firstName} ${lead.buyer.user.lastName}`,
													lead.listing.property.name,
												)}
										>
											Mark As Sold
										</Button>
										<Button
											variant="outline"
											size="sm"
											class="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 md:flex-none"
											disabled={Number(selectedLeadId) === lead.id && declineEnhance.submitting}
											onclick={() =>
												openDeclineDialog(
													lead.id,
													`${lead.buyer.user.firstName} ${lead.buyer.user.lastName}`,
													lead.listing.property.name,
												)}
										>
											Decline
										</Button>
									</div>
								{:else if lead.status === "completed"}
									<div class="mt-5 flex w-full justify-center">
										<div class="rounded-lg bg-green-50 px-4 py-2 text-center">
											<p class="text-sm font-medium text-green-800">✅ Lead Marked as Sold</p>
											<p class="text-xs text-green-600">
												This property was successfully sold to this buyer
											</p>
										</div>
									</div>
								{:else if lead.status === "rejected"}
									<div class="mt-5 flex w-full justify-center">
										<div class="rounded-lg bg-red-50 px-4 py-2 text-center">
											<p class="text-sm font-medium text-red-800">❌ Lead Declined</p>
											<p class="text-xs text-red-600">This lead was declined and closed</p>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if paginatedLeads.totalPages > 1}
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
							{#if paginatedLeads.totalPages <= 7}
								{#each Array(paginatedLeads.totalPages) as _, i}
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
									Page {pageNum} of {paginatedLeads.totalPages}
								</span>
							{/if}
						</div>

						<Button
							variant="outline"
							size="sm"
							disabled={pageNum >= paginatedLeads.totalPages}
							onclick={() => (pageNum = Math.min(paginatedLeads.totalPages, pageNum + 1))}
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

<!-- Mark as Sold Confirmation Dialog -->
<Dialog.Root bind:open={showMarkAsSoldDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-green-700">
				<Check class="h-5 w-5" />
				Mark Lead as Sold
			</Dialog.Title>
			<Dialog.Description>
				This action will close this lead and mark the property as successfully sold to the buyer.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="rounded-lg bg-green-50 p-4">
				<p class="text-sm font-medium text-green-800">Property:</p>
				<p class="text-sm text-green-700">{selectedPropertyName}</p>
			</div>
			<div class="rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-800">Buyer:</p>
				<p class="text-sm text-blue-700">{selectedBuyerName}</p>
			</div>
			<p class="text-sm text-muted-foreground">
				Are you sure you want to proceed? This action cannot be undone.
			</p>
		</div>
		<Dialog.Footer class="flex gap-2">
			<Button variant="outline" onclick={() => (showMarkAsSoldDialog = false)}>Cancel</Button>
			<form method="POST" action="?/markAsSold" class="flex-1" use:markAsSoldEnhance.enhance>
				<input type="hidden" name="offerId" value={selectedLeadId} />
				<Button
					type="submit"
					class="w-full bg-green-600 hover:bg-green-700"
					disabled={markAsSoldEnhance.submitting}
				>
					{#if markAsSoldEnhance.submitting}
						Marking as Sold...
					{:else}
						Mark as Sold
					{/if}
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Decline Lead Confirmation Dialog -->
<Dialog.Root bind:open={showDeclineDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-red-700">
				<X class="h-5 w-5" />
				Decline Lead
			</Dialog.Title>
			<Dialog.Description>
				This action will reject the buyer's offer and close this lead permanently.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="rounded-lg bg-red-50 p-4">
				<p class="text-sm font-medium text-red-800">Property:</p>
				<p class="text-sm text-red-700">{selectedPropertyName}</p>
			</div>
			<div class="rounded-lg bg-blue-50 p-4">
				<p class="text-sm font-medium text-blue-800">Buyer:</p>
				<p class="text-sm text-blue-700">{selectedBuyerName}</p>
			</div>
			<div class="rounded-lg border-2 border-red-200 bg-red-50 p-4">
				<p class="text-sm font-semibold text-red-800">⚠️ Warning</p>
				<p class="text-sm text-red-700">This action cannot be undone once confirmed.</p>
			</div>
		</div>
		<Dialog.Footer class="flex gap-2">
			<Button variant="outline" onclick={() => (showDeclineDialog = false)}>Cancel</Button>
			<form method="POST" action="?/decline" class="flex-1" use:declineEnhance.enhance>
				<input type="hidden" name="offerId" value={selectedLeadId} />
				<Button
					type="submit"
					variant="destructive"
					class="w-full"
					disabled={declineEnhance.submitting}
				>
					{#if declineEnhance.submitting}
						Declining Lead...
					{:else}
						Decline Lead
					{/if}
				</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

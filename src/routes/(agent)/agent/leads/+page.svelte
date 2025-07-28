<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { getDetails, toTitleCase } from "$lib/utils";
	import { Clock, Eye, Heart, MapPin, MessageCircle, User, UserCheck } from "@lucide/svelte";

	let { data } = $props();

	// Pagination state
	const perPage = 6; // Number of items per page
	let pageNum = $state(1);

	// Derived values for pagination
	const paginatedLeads = $derived.by(() => {
		const leads = data.leads || [];
		const totalPages = Math.ceil(leads.length / perPage);
		const paginatedData = leads.slice((pageNum - 1) * perPage, pageNum * perPage);
		return { leads: paginatedData, totalPages, totalCount: leads.length };
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
</script>

<svelte:head>
	<title>My Leads - JuanHomes Agent</title>
</svelte:head>

<div class="mx-auto max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Agent Welcome Section -->
	<div
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
	</div>

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

	{#if !paginatedLeads.totalCount}
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
	{:else}
		<div class="space-y-6">
			<!-- Results summary -->
			<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<p class="text-sm text-muted-foreground">
					{paginatedLeads.totalCount} leads
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
						<div class="flex flex-col gap-6 md:flex-row">
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
								<div class="flex items-start justify-between">
									<div class="space-y-2">
										<h3 class="text-xl font-semibold">{lead.listing.property.name}</h3>
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

								<div class="flex flex-wrap items-center gap-6 text-sm">
									<div class="flex items-center gap-2 font-semibold text-foreground">
										{formatPrice(lead.listing.property.price)}
									</div>
									<div class="flex items-center gap-2 text-muted-foreground">
										<Clock class="h-4 w-4" />
										Offer made {formatDate(lead.dateCreated)}
									</div>
								</div>

								<!-- Buyer Info -->
								<div class="rounded-lg bg-muted/50 p-3">
									<div class="flex items-center gap-2 text-sm">
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

								{#if lead.listing.property.description}
									<p class="line-clamp-2 text-sm text-muted-foreground">
										{lead.listing.property.description}
									</p>
								{/if}

								<!-- Property Features -->
								<p class="text-sm text-muted-foreground">
									{getDetails(lead.listing.property)}
								</p>
							</div>

							<!-- Action Buttons -->
							<div class="flex flex-col gap-3 lg:items-end">
								<Button
									variant="outline"
									size="sm"
									href="/listings/{lead.listing.id}"
									class="flex w-full justify-start"
								>
									<Eye class="mr-2 h-4 w-4" />
									View Property
								</Button>
								<form method="POST" action="?/sendMessage" use:enhance>
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

								{#if lead.status === "new"}
									<div class="flex w-full gap-2">
										<Button
											variant="default"
											size="sm"
											class="flex-1 bg-green-600 hover:bg-green-700"
										>
											Accept
										</Button>
										<Button
											variant="outline"
											size="sm"
											class="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
										>
											Decline
										</Button>
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

<script lang="ts">
	import CarouselListingCard from "$lib/components/listings-page/carousel-listing-card.svelte";
	import { Badge } from "$lib/components/ui/badge/index";
	import { Button } from "$lib/components/ui/button/index";
	import * as Card from "$lib/components/ui/card/index";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import { Separator } from "$lib/components/ui/separator/index";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import {
		Building2,
		Calendar,
		LoaderCircle,
		Mail,
		MapPin,
		MessageCircle,
		Phone,
		Shield,
		Star,
	} from "@lucide/svelte";

	let { data } = $props();

	// Mock data for demo - in real app this would come from database
	const mockStats = {
		rating: (4.0 + Math.random() * 1.0).toFixed(1),
		reviewCount: Math.floor(Math.random() * 100) + 20,
		totalSold: Math.floor(Math.random() * 50) + 10,
		totalClients: Math.floor(Math.random() * 80) + 25,
	};

	let profileImageLoaded = $state(false);

	const sendMessage = moreEnhance({ reset: false });
	const { enhance, submitting } = $derived(sendMessage);

	function getExperienceYears(dateCreated: Date) {
		return new Date().getFullYear() - dateCreated.getFullYear();
	}

	function getCredentialBadgeVariant(credentials: string) {
		if (credentials.includes("Senior") || credentials.includes("Broker")) {
			return "default";
		}
		if (credentials.includes("Specialist")) {
			return "secondary";
		}
		return "outline";
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
		}).format(date);
	}
</script>

<svelte:head>
	<title>{data.agent.user.firstName} {data.agent.user.lastName} - Real Estate Agent Profile</title>
	<meta
		name="description"
		content="View the profile of {data.agent.user.firstName} {data.agent.user
			.lastName}, a professional real estate agent with {getExperienceYears(
			data.agent.user.dateCreated,
		)} years of experience."
	/>
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="mx-auto max-w-7xl px-4 py-8">
		<!-- Agent Profile Header -->
		<div class="mb-8">
			<Card.Root class="overflow-hidden py-0">
				<!-- Header with gradient background -->
				<div class="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
						<!-- Profile Image -->
						<div
							class="relative mx-auto h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 shadow-lg ring-4 ring-white lg:mx-0"
						>
							{#if data.agent.user.profilePicture}
								{#if !profileImageLoaded}
									<div class="absolute inset-0 animate-pulse bg-muted">
										<div
											class="animate-shimmer h-full w-full bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
										></div>
									</div>
								{/if}
								<img
									src={data.agent.user.profilePicture}
									alt="{data.agent.user.firstName} {data.agent.user.lastName}"
									class="h-full w-full object-cover"
									onload={() => (profileImageLoaded = true)}
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white"
								>
									{data.agent.user.firstName.charAt(0)}{data.agent.user.lastName.charAt(0)}
								</div>
							{/if}
							<!-- Verified Badge -->
							{#if data.agent.prcLicenceNumber}
								<div
									class="absolute -right-2 -bottom-2 rounded-full bg-green-500 p-2 text-white shadow-lg"
								>
									<Shield class="h-4 w-4" />
								</div>
							{/if}
						</div>

						<!-- Basic Information -->
						<div class="flex-1 text-center lg:text-left">
							<div class="mb-4">
								<h1 class="text-3xl font-bold text-gray-900">
									{data.agent.user.firstName}
									{data.agent.user.lastName}
								</h1>
								<!-- variant={getCredentialBadgeVariant(data.agent.credentials)} -->
								{#if data.agent.credentials}
									<Badge class="mt-2" variant="outline">
										{data.agent.prcLicenceNumber
											? "PRC License #" + data.agent.prcLicenceNumber
											: "Real Estate Agent"}
									</Badge>
								{/if}
								{#if data.agent.prcLicenceNumber}
									<div
										class="mt-2 flex items-center justify-center gap-2 text-sm text-green-600 lg:justify-start"
									>
										<Shield class="h-4 w-4" />
										<span class="font-medium">Verified Agent</span>
									</div>
								{/if}
							</div>

							<!-- Rating and Stats -->
							<div class="mb-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
								<div class="flex items-center gap-1">
									<Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
									<span class="text-lg font-bold">{mockStats.rating}</span>
									<span class="text-gray-600">({mockStats.reviewCount} reviews)</span>
								</div>
								<Separator orientation="vertical" class="h-6" />
								<div class="text-center">
									<span class="text-lg font-bold text-gray-900">{data.listings.length}</span>
									<span class="text-gray-600"> Active Listings</span>
								</div>
								<Separator orientation="vertical" class="h-6" />
								<div class="text-center">
									<span class="text-lg font-bold text-gray-900">{mockStats.totalSold}</span>
									<span class="text-gray-600"> Properties Sold</span>
								</div>
							</div>

							<!-- Location and Experience -->
							<div class="space-y-2 text-gray-600">
								<div class="flex items-center justify-center gap-2 lg:justify-start">
									<MapPin class="h-4 w-4" />
									<span>{data.agent.user.address.city}, {data.agent.user.address.province}</span>
								</div>
								<div class="flex items-center justify-center gap-2 lg:justify-start">
									<Calendar class="h-4 w-4" />
									<span>{getExperienceYears(data.agent.user.dateCreated)} years of experience</span>
								</div>
								<!-- {#if data.agent.prcLicenceNumber}
									<div class="flex items-center justify-center gap-2 lg:justify-start">
										<Award class="h-4 w-4" />
										<span>PRC License: {data.agent.prcLicenceNumber}</span>
									</div>
								{/if} -->
							</div>
						</div>

						<!-- Contact Actions -->
						<div class="flex flex-col gap-3 lg:w-48">
							{#if data.user}
								<form method="POST" action="?/sendMessage" use:enhance>
									<input type="hidden" name="agentId" value={data.agent.user.id} />
									<Button class="w-full" size="lg" disabled={submitting} type="submit">
										{#if submitting}
											<LoaderCircle class="mr-2 h-5 w-5 animate-spin" />
										{:else}
											<MessageCircle class="mr-2 h-5 w-5" />
										{/if}
										Contact Agent
									</Button>
								</form>
							{:else}
								<Button class="w-full" size="lg" href="/login">
									<MessageCircle class="mr-2 h-5 w-5" />
									Contact Agent
								</Button>
							{/if}
							{#if data.agent.user.mobileNumber}
								<Button variant="outline" class="w-full" size="lg">
									<Phone class="mr-2 h-5 w-5" />
									Call Now
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</Card.Root>
		</div>

		<div class="grid gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="col-span-1 w-full space-y-8 lg:col-span-2">
				<!-- About Section -->
				{#if data.agent.about}
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Building2 class="h-5 w-5" />
								About {data.agent.user.firstName}
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<p class="leading-relaxed text-gray-700">
								{data.agent.about}
							</p>
						</Card.Content>
					</Card.Root>
				{/if}

				<!-- Active Listings -->
				<Card.Root class="w-full max-w-[calc(100dvw-3rem)] gap-5.5">
					<Card.Header>
						<Card.Title class="flex items-center justify-between">
							<span class="flex items-center gap-2">
								<Building2 class="h-5 w-5" />
								Active Listings ({data.listings.length})
							</span>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if data.listings.length > 0}
							<Carousel.Root class="space-y-4">
								<div class="flex w-full items-center justify-between">
									<div class="flex items-center">
										<p class="text-sm text-muted-foreground">
											{data.listings.length} active {data.listings.length === 1
												? "property"
												: "properties"}
										</p>
										<!-- <Button variant="ghost" href="/listings?agent={data.agent.user.id}"
											>View All</Button
										> -->
									</div>
									<div class="inline-flex gap-2">
										<Carousel.Previous />
										<Carousel.Next />
									</div>
								</div>
								<Carousel.Content class="-ml-2 md:-ml-4">
									{#each data.listings as listing (listing.id)}
										<Carousel.Item class="pl-2 md:pl-4 lg:basis-1/2">
											<div class="h-135">
												<CarouselListingCard {...listing} />
											</div>
										</Carousel.Item>
									{/each}
									<!-- {#if data.listings.length > 2}
										<Carousel.Item class="flex basis-auto items-center justify-center pl-2 md:pl-4">
											<a
												href="/listings?agent={data.agent.user.id}"
												class="inline-flex rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-4 text-muted-foreground transition-colors hover:border-muted-foreground/50"
											>
												View All Listings <ChevronLast strokeWidth={1} class="ml-2" />
											</a>
										</Carousel.Item>
									{/if} -->
								</Carousel.Content>
							</Carousel.Root>
						{:else}
							<div class="py-12 text-center">
								<Building2 class="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 class="mb-2 text-lg font-medium text-gray-900">No Active Listings</h3>
								<p class="text-gray-600">This agent currently has no active property listings.</p>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Contact Information -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Contact Information</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						{#if data.agent.user.email}
							<div class="flex items-center gap-3">
								<Mail class="h-5 w-5 text-gray-500" />
								<div>
									<p class="font-medium">Email</p>
									<p class="text-sm text-gray-600">{data.agent.user.email}</p>
								</div>
							</div>
						{/if}
						{#if data.agent.user.mobileNumber}
							<div class="flex items-center gap-3">
								<Phone class="h-5 w-5 text-gray-500" />
								<div>
									<p class="font-medium">Phone</p>
									<p class="text-sm text-gray-600">{data.agent.user.mobileNumber}</p>
								</div>
							</div>
						{/if}
						<div class="flex items-center gap-3">
							<MapPin class="h-5 w-5 text-gray-500" />
							<div>
								<p class="font-medium">Location</p>
								<p class="text-sm text-gray-600">
									{data.agent.user.address.street ? `${data.agent.user.address.street}, ` : ""}{data
										.agent.user.address.barangay}, {data.agent.user.address.city}, {data.agent.user
										.address.province}
								</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Professional Details -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Professional Details</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div>
							<p class="font-medium text-gray-900">Member Since</p>
							<p class="text-sm text-gray-600">{formatDate(data.agent.user.dateCreated)}</p>
						</div>
						<div>
							<p class="font-medium text-gray-900">Experience</p>
							<p class="text-sm text-gray-600">
								{getExperienceYears(data.agent.user.dateCreated)} years in real estate
							</p>
						</div>
						<!-- {#if data.agent.credentials}
							<div>
								<p class="font-medium text-gray-900">Credentials</p>
								<Badge variant={getCredentialBadgeVariant(data.agent.credentials)} class="mt-1">
									{data.agent.credentials}
								</Badge>
							</div>
						{/if} -->
						{#if data.agent.prcLicenceNumber}
							<div>
								<p class="font-medium text-gray-900">PRC License</p>
								<p class="text-sm text-gray-600">#{data.agent.prcLicenceNumber}</p>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Performance Stats -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Performance</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-4">
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Rating</span>
							<div class="flex items-center gap-1">
								<Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span class="font-medium">{mockStats.rating}</span>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Total Reviews</span>
							<span class="font-medium">{mockStats.reviewCount}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Properties Sold</span>
							<span class="font-medium">{mockStats.totalSold}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Active Listings</span>
							<span class="font-medium">{data.listings.length}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-600">Total Clients</span>
							<span class="font-medium">{mockStats.totalClients}</span>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>

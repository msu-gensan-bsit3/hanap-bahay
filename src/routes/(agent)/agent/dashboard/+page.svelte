<script lang="ts">
	import {
		Sidebar,
		StatsCards,
		MonthlyPerformance,
		TodaysTasks,
		RecentListings,
		RecentLeads,
		ActionButtons,
	} from "$lib/components/dashboard";

	// Sample data
	const stats = {
		totalListings: 42,
		approvedListings: 28,
		pendingReview: 7,
		newMessages: 12,
	};

	const monthlyData = [
		{ month: "Jan", activeListings: 35, leadsGenerated: 28, conversions: 12 },
		{ month: "Feb", activeListings: 38, leadsGenerated: 32, conversions: 15 },
		{ month: "Mar", activeListings: 42, leadsGenerated: 35, conversions: 18 },
		{ month: "Apr", activeListings: 45, leadsGenerated: 38, conversions: 20 },
		{ month: "May", activeListings: 48, leadsGenerated: 42, conversions: 22 },
		{ month: "Jun", activeListings: 52, leadsGenerated: 45, conversions: 25 },
	];

	const recentListings = [
		{
			id: 1,
			title: "Luxury Condo in Makati",
			details: "3 BR • 2 BA • 140 sqm",
			price: "₱5,500,000",
			status: "Approved",
			image: "/no-image.jpg",
		},
		{
			id: 2,
			title: "House and Lot in Alabang",
			details: "4 BR • 3 BA • 250 sqm",
			price: "₱23,000,000",
			status: "Pending",
			image: "/no-image.jpg",
		},
		{
			id: 3,
			title: "Studio Unit in BGC",
			details: "1 BR • 1 BA • 35 sqm",
			price: "₱6,800,000",
			status: "Approved",
			image: "/no-image.jpg",
		},
		{
			id: 4,
			title: "Townhouse in Quezon City",
			details: "3 BR • 2 BA • 120 sqm",
			price: "₱12,300,000",
			status: "Needs Revision",
			image: "/no-image.jpg",
		},
	];

	const recentLeads = [
		{
			id: 1,
			name: "Sophia Reyes",
			interest: "Luxury Condo in Makati",
			lastContact: "5:42 AM",
			status: "New",
		},
		{
			id: 2,
			name: "Daniel Tan",
			interest: "Studio Unit in BGC",
			lastContact: "Yesterday, 4:30 PM",
			status: "In Negotiation",
		},
		{
			id: 3,
			name: "Maria Cruz",
			interest: "House and Lot in Alabang",
			lastContact: "2 days ago",
			status: "Meeting Scheduled",
		},
		{
			id: 4,
			name: "James Lim",
			interest: "Townhouse in Quezon City",
			lastContact: "3 days ago",
			status: "New",
		},
	];

	const todaysTasks = [
		{
			id: 1,
			task: "Review 3 property submissions",
			time: "9:00 AM",
			completed: false,
		},
		{
			id: 2,
			task: "Call back Maria about Makati condo",
			time: "11:30 AM",
			completed: false,
		},
		{
			id: 3,
			task: "Update listing photos for BGC property",
			time: "2:30 PM",
			completed: true,
		},
		{
			id: 4,
			task: "Property viewing at Alabang Hills",
			time: "3:00 PM",
			completed: false,
		},
		{
			id: 5,
			task: "Follow up with 5 potential buyers",
			time: "5:00 PM",
			completed: false,
		},
	];

	let mainContentMargin = $state(0);

	$inspect(mainContentMargin);
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Mobile Header (visible on small screens) -->
	<div class="border-b bg-white p-4 shadow-sm lg:hidden">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white"
				>
					J
				</div>
				<span class="ml-2 text-xl font-semibold">JuanHome</span>
			</div>
			<div class="text-sm text-gray-600">Marco Santos</div>
		</div>
	</div>

	<!-- Sidebar -->
	<div class="flex w-full">
		<div class="hidden lg:block">
			<Sidebar />
		</div>

		<div class="w-0 lg:w-64"></div>

		<!-- Main Content -->
		<div class="@container flex-1 p-4 lg:p-8">
			<!-- Header -->
			<div class="mb-6 lg:mb-8">
				<h1 class="text-2xl font-bold text-gray-900 lg:text-3xl">Agent Dashboard</h1>
				<p class="text-sm text-gray-600 @lgtext-base">
					Welcome back, Marco! Here's what's happening with your properties today.
				</p>
			</div>

			<!-- Action Buttons -->
			<div class="mb-6 @lg:mb-8">
				<ActionButtons />
			</div>

			<!-- Stats Cards -->
			<div class="mb-6 @lg:mb-8">
				<StatsCards {stats} />
			</div>

			<!-- <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8"> -->
			<!-- Monthly Performance Chart -->
			<!-- <div class="xl:col-span-2">
				<MonthlyPerformance data={monthlyData} />
			</div> -->

			<!-- Today's Tasks -->
			<!-- <TodaysTasks tasks={todaysTasks} /> -->
			<!-- </div> -->

			<div class="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @4xl:gap-8">
				<!-- Recent Listings -->
				<RecentListings listings={recentListings} />

				<!-- Recent Leads -->
				<RecentLeads leads={recentLeads} />
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

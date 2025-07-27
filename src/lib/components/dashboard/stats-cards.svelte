<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Building, CircleCheck, Clock4, MessageSquare, type IconProps } from "@lucide/svelte";
	import type { Component } from "svelte";

	interface StatCard {
		title: string;
		value: number;
		change: string;
		changeMsg: string;
		action: string;
		icon: Component<IconProps>;
		color: string;
		bgColor: string;
		fill?: string;
		changeColor?: string;
	}

	interface props {
		stats: {
			totalListings: number;
			approvedListings: number;
			pendingReview: number;
			newMessages: number;
		};
	}

	let { stats }: props = $props();

	const statCards: StatCard[] = [
		{
			title: "Total Listings",
			value: stats.totalListings,
			change: "+3%",
			changeMsg: "from last month",
			action: "View all",
			icon: Building,
			color: "text-blue-100",
			bgColor: "bg-blue-500/20",
		},
		{
			title: "Approved Listings",
			value: stats.approvedListings,
			change: "+12%",
			changeMsg: "from last month",
			action: "View all",
			icon: CircleCheck,
			color: "text-green-200",
			bgColor: "bg-green-500/20",
			fill: "#149345",
		},
		{
			title: "Pending Review",
			value: stats.pendingReview,
			change: "+4",
			changeMsg: "new submissions",
			action: "Review now",
			icon: Clock4,
			color: "text-yellow-100",
			bgColor: "bg-yellow-500/20",
			fill: "#B8820F",
		},
		{
			title: "New Messages",
			value: stats.newMessages,
			change: "5",
			changeMsg: "urgent inquiries",
			action: "Reply all",
			icon: MessageSquare,
			color: "text-red-100",
			bgColor: "bg-red-500/20",
		},
	];
</script>

<div class="grid grid-cols-1 gap-6 @2xl:grid-cols-2 @5xl:grid-cols-4">
	{#each statCards as stat}
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">
					<div class="flex gap-4">
						<div class="{stat.bgColor} rounded-3xl p-2 py-3">
							<stat.icon
								fill={stat.fill ?? stat.bgColor.split("-")[1]}
								size={28}
								class="{stat.color} "
							/>
						</div>
						<div class="flex flex-col justify-between">
							<h4 class="text-black/60">{stat.title}</h4>
							<h1 class="text-2xl font-extrabold">{stat.value}</h1>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="flex justify-between items-center">
					<p class="text-xs text-muted-foreground">
						<span class={stat.change.includes("+") ? "text-green-500" : "text-red-500"}>
							{stat.change}
						</span>
						{stat.changeMsg}
					</p>
					<button
						class="cursor-pointer text-xs text-blue-600 transition-colors hover:text-blue-800"
					>
						{stat.action}
					</button>
				</div>
			</CardContent>
		</Card>
	{/each}
</div>

<script lang="ts">
	import { goto } from "$app/navigation";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Building, CircleCheck, Clock4, MessageSquare, type IconProps } from "@lucide/svelte";
	import type { Component } from "svelte";

	interface StatCard {
		title: string;
		value: number;
		change: string;
		changeMsg: string;
		action: string;
		onclick?: () => void;
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
			totalLeads: number;
		};
	}

	let { stats }: props = $props();

	const statCards: StatCard[] = [
		{
			title: "Total Listings",
			value: stats.totalListings,
			change: stats.totalListings > 0 ? "+2%" : "0%",
			changeMsg: "from last month",
			action: "View all",
			onclick: () => goto("/agent/listings"),
			icon: Building,
			color: "text-blue-100",
			bgColor: "bg-blue-500/20",
		},
		{
			title: "Approved Listings",
			value: stats.approvedListings,
			change: stats.approvedListings > 0 ? "+8%" : "0%",
			changeMsg: "from last month",
			action: "View approved",
			onclick: () => goto("/agent/listings?status=up"),
			icon: CircleCheck,
			color: "text-green-200",
			bgColor: "bg-green-500/20",
			fill: "#149345",
		},
		{
			title: "Pending Review",
			value: stats.pendingReview,
			change: stats.pendingReview > 0 ? `+${stats.pendingReview}` : "0",
			changeMsg: "awaiting review",
			action: "Review now",
			onclick: () => goto("/agent/listings?status=under-review"),
			icon: Clock4,
			color: "text-yellow-100",
			bgColor: "bg-yellow-500/20",
			fill: "#B8820F",
		},
		{
			title: "Total Leads",
			value: stats.totalLeads,
			change: stats.totalLeads > 0 ? `+${Math.min(stats.totalLeads, 15)}%` : "0%",
			changeMsg: "interested buyers",
			action: "View leads",
			onclick: () => goto("/agent/offers"),
			icon: MessageSquare,
			color: "text-purple-100",
			bgColor: "bg-purple-500/20",
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
				<div class="flex items-center justify-between">
					<p class="text-xs text-muted-foreground">
						<span class={stat.change.includes("+") ? "text-green-500" : "text-red-500"}>
							{stat.change}
						</span>
						{stat.changeMsg}
					</p>
					<button
						class="cursor-pointer text-xs text-blue-600 transition-colors hover:text-blue-800"
						onclick={stat.onclick}
					>
						{stat.action}
					</button>
				</div>
			</CardContent>
		</Card>
	{/each}
</div>

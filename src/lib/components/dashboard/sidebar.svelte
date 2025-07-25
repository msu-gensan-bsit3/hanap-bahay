<script lang="ts">
	import { page } from "$app/state";
	import { Badge } from "$lib/components/ui/badge";
	import {
		Building,
		LayoutDashboard,
		MessageSquare,
		Settings,
		Users,
		type IconProps,
	} from "@lucide/svelte";
	import type { Component } from "svelte";

	interface NavigationItem {
		label: string;
		href: string;
		icon: Component<IconProps>;
		badge?: number;
		fillRule?: boolean;
	}

	const navigationItems: NavigationItem[] = [
		{
			label: "Dashboard",
			href: "/agent/dashboard",
			icon: LayoutDashboard,
		},
		{
			label: "Listings",
			href: "/agent/listings",
			icon: Building,
		},
		{
			label: "Messages",
			href: "/agent/messages",
			icon: MessageSquare,
			badge: 12,
		},
		{
			label: "Leads",
			href: "/agent/leads",
			icon: Users,
		},
		// {
		// 	label: 'Analytics',
		// 	href: '/agent/analytics',
		// 	icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
		// },
		// {
		// 	label: 'Commission',
		// 	href: '/agent/commission',
		// 	icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		// },
		{
			label: "Settings",
			href: "/agent/settings",
			icon: Settings,
			fillRule: true,
		},
	];

	const agentInfo = {
		name: "Marco Santos",
		license: "PRC Lic #12345",
		avatar: "/no-profile.jpg",
		status: "Available",
	};
</script>

<div class="fixed inset-y-0 left-0 h-screen w-64 bg-white shadow-lg">
	<!-- Header -->
	<div class="flex items-center border-b px-6 py-4">
		<div class="flex items-center">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white"
			>
				J
			</div>
			<span class="ml-2 text-xl font-semibold">JuanHome</span>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="mt-8">
		{#each navigationItems as item}
			<div class="px-6 py-2">
				<a
					href={item.href}
					class="flex items-center rounded-lg px-4 py-2 {page.url.pathname === item.href
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
				>
					<div class="flex items-center gap-2">
						<item.icon class="" size={16} />
						<span>{item.label}</span>
					</div>
					{#if item.badge}
						<Badge class="ml-auto bg-red-500">{item.badge}</Badge>
					{/if}
				</a>
			</div>
		{/each}
	</nav>

	<!-- Agent Profile -->
	<div class="absolute bottom-0 w-full border-t p-6">
		<div class="flex items-center">
			<div class="relative">
				<img class="h-10 w-10 rounded-full" src={agentInfo.avatar} alt={agentInfo.name} />
				<div
					class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400"
				></div>
			</div>
			<div class="ml-3">
				<p class="text-sm font-medium text-gray-900">{agentInfo.name}</p>
				<p class="text-xs text-gray-500">{agentInfo.license}</p>
			</div>
		</div>
	</div>
</div>

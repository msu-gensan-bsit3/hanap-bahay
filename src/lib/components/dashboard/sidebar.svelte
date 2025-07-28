<script lang="ts">
	import { page } from "$app/state";
	import { Badge } from "$lib/components/ui/badge";
	import { getAgentContext } from "$lib/contexts/agentContext";
	import {
		Building,
		LayoutDashboard,
		LogOut,
		Menu,
		MessageSquare,
		Settings,
		Users,
		type IconProps,
	} from "@lucide/svelte";
	import type { Component } from "svelte";
	import { slide } from "svelte/transition";

	interface NavigationItem {
		label: string;
		href: string;
		icon: Component<IconProps>;
		badge?: number;
		fillRule?: boolean;
	}

	interface props {
		sidebarOpen?: boolean;
		mobile?: boolean;
		onToggle?: () => void;
	}

	let { sidebarOpen = true, mobile = false, onToggle }: props = $props();

	const agentData = getAgentContext();

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
		{
			label: "Settings",
			href: "/agent/settings",
			icon: Settings,
			fillRule: true,
		},
	];

	const agentInfo = $derived({
		name: `${agentData.userData.user.firstName} ${agentData.userData.user.lastName}`,
		license: agentData.userData.agent.credentials,
		avatar: "/no-profile.jpg",
		status: "Available",
	});

	function handleLogout() {
		fetch("/logout", { method: "POST" }).then(() => {
			window.location.href = "/login";
		});
	}
</script>

<div
	class="fixed inset-y-0 left-0 h-screen bg-white shadow-lg transition-all duration-100
		{mobile ? 'z-50' : ''} {sidebarOpen ? 'w-64' : 'w-16'}"
>
	<!-- Header -->
	{#if sidebarOpen}
		<div
			class="flex items-center justify-between border-b px-6 py-4"
			transition:slide={{ delay: 0 }}
		>
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-2">
					<img src="/juanhomes-logo-text.png" alt="juanhomes-logo" class="h-10 w-full" />
				</a>
			</div>
			{#if !mobile && onToggle}
				<button
					onclick={onToggle}
					class="rounded px-3 py-2 transition-colors hover:bg-gray-100"
					title="Show sidebar"
				>
					<Menu size={18} />
				</button>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col items-center border-b p-2" transition:slide={{ delay: 0 }}>
			{#if !mobile && onToggle}
				<button
					onclick={onToggle}
					class="rounded px-3 py-2 transition-colors hover:bg-gray-100"
					title="Show sidebar"
				>
					<Menu size={18} />
				</button>
			{/if}
		</div>
	{/if}

	<!-- Navigation -->
	<nav class="mt-5">
		{#each navigationItems as item}
			<div class="{sidebarOpen ? 'px-6' : 'px-3'} py-2">
				<a
					href={item.href}
					class="flex items-center rounded-lg {sidebarOpen
						? 'px-4'
						: 'justify-center px-2'} py-2 {page.url.pathname === item.href
						? 'bg-blue-50 text-blue-600'
						: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
					title={!sidebarOpen ? item.label : ""}
				>
					{#if sidebarOpen}
						<div class="flex items-center gap-2">
							<item.icon class="" size={16} />
							<span>{item.label}</span>
						</div>
						{#if item.badge}
							<Badge class="ml-auto bg-red-500">{item.badge}</Badge>
						{/if}
					{:else}
						<div class="relative">
							<item.icon class="" size={16} />
							{#if item.badge}
								<Badge
									class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-red-500 p-0 text-xs"
									>{item.badge}</Badge
								>
							{/if}
						</div>
					{/if}
				</a>
			</div>
		{/each}
	</nav>

	<!-- Agent Profile -->
	{#if sidebarOpen}
		<div class="absolute bottom-0 w-full border-t bg-white">
			<div class="flex items-center justify-between p-6">
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
				<button
					onclick={handleLogout}
					class="rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
					title="Logout"
				>
					<LogOut size={16} />
				</button>
			</div>
		</div>
	{:else}
		<div class="absolute bottom-0 flex w-full justify-center border-t p-3">
			<div class="relative">
				<img
					class="h-8 w-8 rounded-full"
					src={agentInfo.avatar}
					alt={agentInfo.name}
					title={agentInfo.name}
				/>
				<div
					class="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-white bg-green-400"
				></div>
			</div>
		</div>
	{/if}
</div>

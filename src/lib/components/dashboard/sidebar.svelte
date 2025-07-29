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
		Users,
		type IconProps,
	} from "@lucide/svelte";
	import type { Component } from "svelte";
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";

	interface NavigationItem {
		label: string;
		href: string;
		icon: Component<IconProps>;
		badge?: number | undefined;
		fillRule?: boolean;
	}

	interface props {
		sidebarOpen?: boolean;
		mobile?: boolean;
		onToggle?: () => void;
	}

	let { sidebarOpen = true, mobile = false, onToggle }: props = $props();

	const agentData = getAgentContext();
	let unreadMessageCount = $state(0);
	let previousUnreadCount = $state(0);
	let hasNewMessage = $state(false);

	// Function to fetch unread message count
	async function fetchUnreadMessageCount() {
		try {
			const response = await fetch("/api/unread-messages");
			if (response.ok) {
				const data = await response.json();
				const newCount = data.count || 0;

				// Check if we have new messages
				if (newCount > previousUnreadCount && previousUnreadCount !== 0) {
					hasNewMessage = true;
					setTimeout(() => {
						hasNewMessage = false;
					}, 3000); // Reset after 3 seconds
				}

				previousUnreadCount = unreadMessageCount;
				unreadMessageCount = newCount;
			}
		} catch (error) {
			console.error("Failed to fetch unread message count:", error);
		}
	}

	onMount(() => {
		fetchUnreadMessageCount();
		// Poll for updates every 30 seconds
		const interval = setInterval(fetchUnreadMessageCount, 30000);
		return () => clearInterval(interval);
	});

	// Update unread count when leaving messages page
	$effect(() => {
		if (page.url.pathname === "/agent/messages") {
			// If user is on messages page, reset count after a short delay to allow time for read status to update
			setTimeout(() => {
				fetchUnreadMessageCount();
			}, 2000);
		}
	});

	// Also listen for storage events to sync between tabs
	onMount(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "unread-messages-updated") {
				fetchUnreadMessageCount();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	});

	const navigationItems = $derived([
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
			label: "Leads",
			href: "/agent/leads",
			icon: Users,
		},
		{
			label: "Messages",
			href: "/agent/messages",
			icon: MessageSquare,
			badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
		},
		// {
		// 	label: "Settings",
		// 	href: "/agent/settings",
		// 	icon: Settings,
		// 	fillRule: true,
		// },
	]);

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

	function handleNavClick(href: string) {
		if (href === "/agent/messages") {
			// Reset unread count immediately when clicking messages and trigger storage event
			setTimeout(() => {
				fetchUnreadMessageCount();
				localStorage.setItem("unread-messages-updated", Date.now().toString());
			}, 500);
		}
	}
</script>

<div
	class="fixed inset-y-0 left-0 h-screen border-r border-gray-200/60 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl transition-all duration-300 ease-in-out
		{mobile ? 'z-50' : ''} {sidebarOpen ? 'w-64' : 'w-16'}"
>
	<!-- Header -->
	{#if sidebarOpen}
		<div
			class="flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-sm"
			transition:slide={{ delay: 0, duration: 250 }}
		>
			<div class="flex items-center">
				<a href="/" class="group flex items-center space-x-2">
					<img
						src="/juanhomes-logo-text.png"
						alt="juanhomes-logo"
						class="h-10 w-full transition-transform group-hover:scale-105"
					/>
				</a>
			</div>
			{#if !mobile && onToggle}
				<button
					onclick={onToggle}
					class="rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95"
					title="Collapse sidebar"
				>
					<Menu size={18} class="text-gray-600" />
				</button>
			{/if}
		</div>
	{:else}
		<div
			class="flex flex-col items-center border-b border-gray-200 bg-white/80 p-3 backdrop-blur-sm"
			transition:slide={{ delay: 0, duration: 250 }}
		>
			{#if !mobile && onToggle}
				<button
					onclick={onToggle}
					class="rounded-lg px-3 py-2 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95"
					title="Expand sidebar"
				>
					<Menu size={18} class="text-gray-600" />
				</button>
			{/if}
		</div>
	{/if}

	<!-- Navigation -->
	<nav class="mt-6 space-y-1 px-3">
		{#each navigationItems as item, index}
			<div class="relative" style="animation-delay: {index * 50}ms">
				<a
					href={item.href}
					onclick={() => handleNavClick(item.href)}
					class="group flex transform items-center rounded-xl transition-all duration-200 ease-in-out {sidebarOpen
						? 'px-4 py-3'
						: 'justify-center px-3 py-3'} {page.url.pathname === item.href
						? 'scale-[1.02] bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
						: 'text-gray-700 hover:scale-[1.02] hover:bg-white hover:shadow-lg hover:shadow-gray-500/10 active:scale-[0.98]'}"
					title={!sidebarOpen
						? item.href === "/agent/messages" && item.badge
							? `${item.label} (${item.badge} unread)`
							: item.label
						: ""}
				>
					{#if sidebarOpen}
						<div class="flex w-full items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="relative">
									<item.icon
										class="transition-all duration-200 group-hover:scale-110 {page.url.pathname ===
										item.href
											? 'text-white drop-shadow-sm'
											: 'text-gray-600'} {item.href === '/agent/messages' && hasNewMessage
											? 'animate-bounce'
											: ''}"
										size={20}
									/>
									{#if item.href === "/agent/messages" && item.badge !== undefined && item.badge > 0}
										<div
											class="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-red-500"
										></div>
									{/if}
								</div>
								<span class="font-medium transition-all duration-200">{item.label}</span>
							</div>
							{#if item.badge !== undefined && item.badge > 0}
								<Badge
									class="ml-auto animate-pulse border border-red-400 bg-red-500 text-white shadow-lg transition-all duration-200 hover:bg-red-600 {hasNewMessage &&
									item.href === '/agent/messages'
										? 'animate-bounce'
										: ''}"
								>
									{item.badge > 99 ? "99+" : item.badge}
								</Badge>
							{/if}
						</div>
					{:else}
						<div class="relative">
							<item.icon
								class="transition-all duration-200 group-hover:scale-125 {page.url.pathname ===
								item.href
									? 'text-white drop-shadow-sm'
									: 'text-gray-600'} {item.href === '/agent/messages' && hasNewMessage
									? 'animate-bounce'
									: ''}"
								size={20}
							/>
							{#if item.badge !== undefined && item.badge > 0}
								<Badge
									class="absolute -top-2 -right-2 flex h-5 w-5 animate-pulse items-center justify-center border-2 border-white bg-red-500 p-0 text-xs text-white shadow-lg transition-all duration-200 {hasNewMessage &&
									item.href === '/agent/messages'
										? 'animate-bounce'
										: ''}"
								>
									{item.badge > 9 ? "9+" : item.badge}
								</Badge>
							{/if}
						</div>
					{/if}
				</a>
			</div>
		{/each}
	</nav>

	<!-- Agent Profile -->
	{#if sidebarOpen}
		<div class="absolute bottom-0 w-full border-t border-gray-200 bg-white/90 backdrop-blur-sm">
			<div class="flex items-center justify-between p-4">
				<div class="flex min-w-0 flex-1 items-center">
					<div class="relative">
						<img
							class="h-12 w-12 rounded-full object-cover shadow-md ring-2 ring-gray-200"
							src={agentInfo.avatar}
							alt={agentInfo.name}
						/>
						<div
							class="absolute -right-1 -bottom-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-500 shadow-sm"
						></div>
					</div>
					<div class="ml-3 min-w-0 flex-1">
						<p class="truncate text-sm font-semibold text-gray-900">{agentInfo.name}</p>
						<p class="truncate text-xs text-gray-500">{agentInfo.license}</p>
						<div class="mt-1 flex items-center gap-1">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-xs font-medium text-green-600">{agentInfo.status}</span>
						</div>
					</div>
				</div>
				<button
					onclick={handleLogout}
					class="rounded-lg p-2.5 text-gray-500 transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:text-red-600 active:scale-95"
					title="Logout"
				>
					<LogOut size={18} />
				</button>
			</div>
		</div>
	{:else}
		<div
			class="absolute bottom-0 flex w-full justify-center border-t border-gray-200 bg-white/90 p-4 backdrop-blur-sm"
		>
			<div class="group relative">
				<img
					class="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-gray-200 transition-transform group-hover:scale-110"
					src={agentInfo.avatar}
					alt={agentInfo.name}
					title={agentInfo.name}
				/>
				<div
					class="absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-sm"
				></div>
			</div>
		</div>
	{/if}
</div>

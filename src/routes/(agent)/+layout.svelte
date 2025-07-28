<script lang="ts">
	import { Sidebar } from "$lib/components/dashboard";
	import TransitionOverlay from "$lib/components/transition-overlay.svelte";
	import { setAgentContext } from "$lib/contexts/agentContext";
	import { Menu, X } from "@lucide/svelte";

	let { children, data } = $props();
	let sidebarOpen = $state(true);
	let mobileMenuOpen = $state(false);
	let container: HTMLElement | undefined = $state();

	setAgentContext(data);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<TransitionOverlay />

<div class="min-h-screen bg-gray-50">
	<!-- Mobile Header (visible on small screens) -->
	<div
		class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden"
	>
		<div class="flex h-16 items-center justify-between px-4">
			<div class="flex items-center">
				<button onclick={toggleMobileMenu} class="mr-3 rounded p-1 hover:bg-accent">
					{#if mobileMenuOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
				</button>
				<a href="/" class="flex items-center space-x-2">
					<img src="/juanhomes-logo-text.png" alt="juanhomes-logo" class="h-10 w-full" />
				</a>
			</div>
			{#if data.userData.user}
				<div class="flex items-center gap-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
					>
						{data.userData.user.firstName.charAt(0)}{data.userData.user.lastName.charAt(0)}
					</div>
					<span class="text-sm font-medium"
						>{data.userData.user.firstName} {data.userData.user.lastName}</span
					>
				</div>
			{/if}
		</div>
	</div>

	<!-- Sidebar -->
	<div class="flex w-full">
		<!-- Desktop Sidebar -->
		<div class="hidden lg:block">
			<Sidebar {sidebarOpen} onToggle={toggleSidebar} />
		</div>

		<!-- Mobile Sidebar Overlay -->
		{#if mobileMenuOpen}
			<div class="fixed inset-0 z-50 lg:hidden">
				<button
					class="absolute inset-0 bg-black/50"
					onclick={toggleMobileMenu}
					onkeydown={(e) => e.key === "Escape" && toggleMobileMenu()}
					aria-label="Close sidebar"
				></button>
				<div class="relative">
					<Sidebar sidebarOpen={true} mobile={true} />
				</div>
			</div>
		{/if}

		<div class="w-0 {sidebarOpen ? 'lg:w-64' : 'lg:w-16'}"></div>

		<!-- Main Content -->
		<div class="@container flex-1">
			<!-- <AgentBreadcrumbs /> -->
			<div class="p-4" bind:this={container}>
				{@render children()}
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

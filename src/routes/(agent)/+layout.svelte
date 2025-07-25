<script lang="ts">
	import { Sidebar } from "$lib/components/dashboard";
	import { Menu, X } from "@lucide/svelte";
	import { setContext } from "svelte";

	let { children } = $props();
	let sidebarOpen = $state(true);
	let mobileMenuOpen = $state(false);
	let container: HTMLElement | undefined = $state();

	setContext("container", () => container);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Mobile Header (visible on small screens) -->
	<div class="border-b bg-white p-4 shadow-sm lg:hidden">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<button onclick={toggleMobileMenu} class="mr-3 rounded p-1 hover:bg-gray-100">
					{#if mobileMenuOpen}
						<X size={20} />
					{:else}
						<Menu size={20} />
					{/if}
				</button>
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
		<div class="@container flex-1 p-4" bind:this={container}>
			{@render children()}
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

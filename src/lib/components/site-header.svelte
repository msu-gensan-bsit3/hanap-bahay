<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import { Button } from "$lib/components/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import type { Agent } from "$lib/server/db/schema";
	import type { SessionValidationResult } from "$lib/server/services/auth";
	import { heights } from "$lib/states/heights.svelte";
	import {
		Building2,
		LayoutDashboard,
		LogOut,
		Menu,
		MessageCircleMore,
		Plus,
		SquareUserRound,
		User,
		X,
	} from "@lucide/svelte";

	type Props = {
		user: SessionValidationResult["user"];
		curAgent?: Agent;
	};

	let { user, curAgent }: Props = $props();

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleItemSelect(href: string) {
		return () => {
			closeMobileMenu();
			window.location.href = href;
		};
	}

	function handleLogout() {
		fetch("/logout", { method: "POST" }).then(() => {
			window.location.href = "/login";
		});
	}

	function getUserInitials(firstName: string, lastName: string) {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}
</script>

<header
	class="sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85"
	bind:clientHeight={heights.header}
>
	<div class="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4 lg:px-6">
		<!-- Logo -->
		<div class="flex items-center">
			<a href="/" class="flex items-center space-x-2">
				<img src="/juanhomes-logo-text.png" alt="juanhomes-logo" class="h-14 w-full" />
				<!-- <span class="text-2xl font-bold text-primary sm:text-2xl">JuanHomes</span> -->
			</a>
		</div>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-8 md:flex">
			<div class="flex items-center gap-6">
				{#if curAgent}
					<!-- <Button href="/agent/dashboard" variant="default">Dashboard</Button> -->
					<!-- <a
						href="/agent/dashboard"
						class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
					</a> -->
				{/if}
				{#if user}
					<a
						href="/create-listing"
						class="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						<Plus size={20} />
						Create Listing
					</a>
				{/if}
				<a
					href="/listings"
					class="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					<Building2 size={20} />
					Listings
				</a>
				<a
					href="/agents"
					class="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					<SquareUserRound size={20} />
					Agents
				</a>
			</div>

			<div class="flex items-center gap-4">
				{#if user}
					<!-- Logged in user -->
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex items-center gap-2 rounded-md p-2 hover:bg-accent">
							<Avatar.Root class="h-8 w-8">
								<Avatar.Image
									src={user.profilePicture || undefined}
									alt={`${user.firstName} ${user.lastName}`}
								/>
								<Avatar.Fallback>
									{getUserInitials(user.firstName, user.lastName)}
								</Avatar.Fallback>
							</Avatar.Root>
							<span class="text-sm font-medium">{user.firstName} {user.lastName}</span>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-40">
							<DropdownMenu.Item class="w-full p-0">
								<a
									href="{curAgent ? '/agent' : ''}/dashboard"
									class="flex w-full cursor-pointer items-center gap-2 p-2"
								>
									<LayoutDashboard class="h-4 w-4" />
									Dashboard
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="w-full p-0">
								<a
									href="{curAgent ? '/agent' : ''}/profile"
									class="flex w-full cursor-pointer items-center gap-2 p-2"
								>
									<User class="h-4 w-4" />
									Profile
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item class="w-full p-0">
								<a
									href="{curAgent ? '/agent' : ''}/messages"
									class="flex w-full cursor-pointer items-center gap-2 p-2"
									title="Messages"
								>
									<MessageCircleMore class="size-4" />
									Messages
								</a>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item class="w-full p-0">
								<a href="/logout" class="flex w-full cursor-pointer items-center gap-2 p-2">
									<LogOut class="h-4 w-4" />
									Logout
								</a>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<!-- Not logged in -->
					<Button variant="ghost" href="/login" class="text-sm font-medium">Sign In</Button>
					<Button href="/register" class="text-sm font-medium">Sign Up</Button>
				{/if}
			</div>
		</nav>

		<!-- Mobile Navigation -->
		<div class="flex items-center gap-4 md:hidden">
			{#if user}
				<!-- Logged in user - mobile -->
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="flex items-center gap-2 rounded-md p-1">
						<Avatar.Root class="h-8 w-8">
							<Avatar.Image
								src={user.profilePicture || undefined}
								alt={`${user.firstName} ${user.lastName}`}
							/>
							<Avatar.Fallback>
								{getUserInitials(user.firstName, user.lastName)}
							</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-56">
						<DropdownMenu.Item class="w-full p-0">
							<a
								href="{curAgent ? '/agent' : ''}/profile"
								class="flex w-full cursor-pointer items-center gap-2 p-2"
							>
								<User class="h-4 w-4" />
								Profile
							</a>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item class="flex items-center gap-2" onSelect={handleLogout}>
							<LogOut class="h-4 w-4" />
							Logout
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<!-- Not logged in - mobile -->
				<Button variant="ghost" href="/login" size="sm" class="text-sm">Sign In</Button>
			{/if}

			<DropdownMenu.Root bind:open={mobileMenuOpen}>
				<DropdownMenu.Trigger
					class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
				>
					{#if mobileMenuOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
					<span class="sr-only">Toggle menu</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					<DropdownMenu.Item>
						<a href="{curAgent ? '/agent' : ''}/dashboard" class="flex w-full items-center gap-2">
							<LayoutDashboard />
							Dashboard
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<a href="/messages" class="flex w-full items-center gap-2">
							<MessageCircleMore />
							Messages
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<a href="/create-listing" class="flex w-full items-center gap-2">
							<Plus />
							Create Listing
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<a href="/listings" class="flex w-full items-center gap-2">
							<Building2 />
							Listings
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<a href="/agents" class="flex w-full items-center gap-2">
							<SquareUserRound />
							Agents
						</a>
					</DropdownMenu.Item>
					{#if !user}
						<DropdownMenu.Separator />
						<DropdownMenu.Item onSelect={handleItemSelect("/register")}>Sign Up</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</header>

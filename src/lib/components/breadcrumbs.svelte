<script lang="ts">
	import { page } from "$app/state";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import { Home } from "@lucide/svelte";
	import { breadcrumbContext } from "$lib/stores/breadcrumb";

	// Define route-to-label mappings for better UX
	const routeLabels: Record<string, string> = {
		"": "Home",
		"listings": "Properties",
		"agent": "Agent Portal",
		"dashboard": "Dashboard",
		"messages": "Messages",
		"profile": "Profile",
		"login": "Sign In",
		"register": "Sign Up",
		"leads": "Leads",
		"settings": "Settings",
		"user": "Account"
	};

	// Generate breadcrumb items from current pathname
	const breadcrumbItems = $derived(() => {
		const path = page.url.pathname;
		const segments = path.split('/').filter(segment => segment !== '');
		
		const items = [
			{ href: "/", label: "Home", isHome: true }
		];

		let currentPath = "";
		
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			
			// Skip auth routes for breadcrumbs
			if (segment === "(auth)" || segment === "(app)" || segment === "(agent)" || segment === "(user)") {
				return;
			}
			
			// For dynamic routes (like [id]), use a generic label or fetch actual data
			let label = routeLabels[segment] || segment;
			
			// Handle dynamic listing routes
			if (segments[index - 1] === "listings" && /^\d+$/.test(segment)) {
				label = $breadcrumbContext.propertyName || "Property Details";
			}
			
			// Capitalize first letter if no custom label
			if (!routeLabels[segment]) {
				label = segment.charAt(0).toUpperCase() + segment.slice(1);
			}
			
			items.push({
				href: currentPath,
				label,
				isHome: false
			});
		});

		return items;
	});

	// Don't show breadcrumbs on home page or auth pages
	const shouldShowBreadcrumbs = $derived(() => {
		const path = page.url.pathname;
		return path !== "/" && 
			   !path.includes("/login") && 
			   !path.includes("/register") &&
			   breadcrumbItems().length > 1;
	});
</script>

{#if shouldShowBreadcrumbs()}
	<div class="border-b bg-muted/40 px-4 py-3">
		<div class="mx-auto max-w-screen-xl">
			<Breadcrumb.Root>
				<Breadcrumb.List>
					{#each breadcrumbItems() as item, index}
						<Breadcrumb.Item>
							{#if index === breadcrumbItems().length - 1}
								<!-- Current page -->
								<Breadcrumb.Page>
									{item.label}
								</Breadcrumb.Page>
							{:else}
								<!-- Linkable breadcrumb -->
								<Breadcrumb.Link href={item.href} class="flex items-center gap-1">
									{#if item.isHome}
										<Home class="mr-1 h-4 w-4" />
									{/if}
									{item.label}
								</Breadcrumb.Link>
							{/if}
						</Breadcrumb.Item>
						
						{#if index < breadcrumbItems().length - 1}
							<Breadcrumb.Separator />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>
	</div>
{/if}

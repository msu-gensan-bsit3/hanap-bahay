<script lang="ts">
	import { page } from "$app/state";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import { Building } from "@lucide/svelte";

	// Define route-to-label mappings for agent portal
	const agentRouteLabels: Record<string, string> = {
		agent: "Agent Portal",
		dashboard: "Dashboard",
		listings: "My Listings",
		messages: "Messages",
		leads: "Leads",
		profile: "Profile",
		settings: "Settings",
	};

	// Generate breadcrumb items from current pathname
	const breadcrumbItems = $derived(() => {
		const path = page.url.pathname;
		const segments = path.split("/").filter((segment) => segment !== "");

		const items = [{ href: "/agent/dashboard", label: "Agent Portal", isHome: true }];

		let currentPath = "";
		let foundAgent = false;

		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;

			// Skip route groups
			if (segment === "(agent)" || segment === "(app)") {
				return;
			}

			// Mark that we've found the agent segment
			if (segment === "agent") {
				foundAgent = true;
				return; // Don't add agent itself to breadcrumbs since it's our home
			}

			// Only process agent portal routes
			if (!foundAgent) {
				return;
			}

			let label = agentRouteLabels[segment] || segment;

			// Handle dynamic routes
			if (segments[index - 1] === "listings" && /^\d+$/.test(segment)) {
				label = "Listing Details";
			}

			// Capitalize first letter if no custom label
			if (!agentRouteLabels[segment]) {
				label = segment.charAt(0).toUpperCase() + segment.slice(1);
			}

			items.push({
				href: currentPath,
				label,
				isHome: false,
			});
		});

		return items;
	});

	// Only show breadcrumbs in agent portal and when there are multiple items
	const shouldShowBreadcrumbs = $derived(() => {
		const path = page.url.pathname;
		return path.startsWith("/agent") && breadcrumbItems().length > 1;
	});
</script>

{#if shouldShowBreadcrumbs()}
	<div class="border-b bg-white px-4 py-3">
		<div class="mx-auto max-w-7xl">
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
										<Building class="mr-1 h-4 w-4" />
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

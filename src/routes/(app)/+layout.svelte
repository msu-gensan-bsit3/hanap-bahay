<script lang="ts">
	import Breadcrumbs from "$lib/components/breadcrumbs.svelte";
	import SiteFooter from "$lib/components/site-footer.svelte";
	import SiteHeader from "$lib/components/site-header.svelte";
	import TransitionOverlay from "$lib/components/transition-overlay.svelte";
	import type { Snippet } from "svelte";
	import type { LayoutServerData } from "./$types";

	let { children, data }: { children: Snippet; data: LayoutServerData } = $props();
</script>

<TransitionOverlay />

<div class="flex min-h-screen flex-col">
	<SiteHeader {...data} />
	<Breadcrumbs />
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<SiteFooter />
</div>

<script lang="ts">
	import SiteHeader from "$lib/components/site-header.svelte";
	import SiteFooter from "$lib/components/site-footer.svelte";
	import TransitionOverlay from "$lib/components/transition-overlay.svelte";
	import type { LayoutServerData } from './$types';

	let { children, data }: { children: any; data: LayoutServerData } = $props();
</script>


<TransitionOverlay />

<div>
	<SiteHeader user={data.user} />
	<main>
		{@render children()}
	</main>
	<SiteFooter />
</div>

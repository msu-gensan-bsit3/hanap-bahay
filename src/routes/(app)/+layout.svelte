<script lang="ts">
	import SiteHeader from "$lib/components/site-header.svelte";
	import SiteFooter from "$lib/components/site-footer.svelte";
	import TransitionOverlay from "$lib/components/transition-overlay.svelte";

	let { children } = $props();
</script>


<TransitionOverlay />

<div>
	<SiteHeader />
	<main>
		{@render children()}
	</main>
	<SiteFooter />
</div>

<script lang="ts">
	import SiteHeader from "$lib/components/site-header.svelte"
	import SiteFooter from "$lib/components/site-footer.svelte"

	let { children } = $props();
</script>

<div>
	<SiteHeader />
		<main>
			{@render children()}
		</main>
	<SiteFooter />
</div>
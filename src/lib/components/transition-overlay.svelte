<script lang="ts">
	import { beforeNavigate } from "$app/navigation";
	import { fade } from "svelte/transition";

	let showTransition = $state(false);

	beforeNavigate(async (e) => {
		showTransition = true;
		await e.complete;
		showTransition = false;
	});
</script>

{#if showTransition}
	<div
		class="fixed z-100 h-screen w-full animate-pulse bg-black/50"
		transition:fade={{ duration: 200 }}
	></div>
{/if}

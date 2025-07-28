<script lang="ts">
	import "../app.css";
	let { children } = $props();
</script>

<svelte:head>
	<title>JuanHome</title>
</svelte:head>

{@render children()}

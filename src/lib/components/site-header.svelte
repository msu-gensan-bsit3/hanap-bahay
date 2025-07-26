<script lang="ts">
	import { heights } from "$lib/states/heights.svelte";
</script>

<header class="h-16 w-full border-b bg-background" bind:clientHeight={heights.header}>
	<div class="mx-auto flex h-full max-w-screen-xl items-center justify-between">
		<div class="flex items-center gap-8">
			<span class="text-3xl font-bold">JuanHomes</span>
			<nav class="flex items-center gap-6 text-sm font-medium">
				<a href="/">Buy</a>
				<a href="/">Rent</a>
				<a href="/">Sell</a>
				<a href="/">Agents</a>
			</nav>
		</div>
		<nav class="flex items-center gap-8 text-sm font-medium">
			<a href="/">Sign In</a>
			<a href="/" class="rounded-lg bg-foreground px-6 py-2 text-primary-foreground">Sign Up</a>
		</nav>
	</div>
</header>

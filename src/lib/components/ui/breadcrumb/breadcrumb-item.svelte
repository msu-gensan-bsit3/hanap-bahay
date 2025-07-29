<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	let { 
		class: className,
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props();
</script>

<li class={cn("inline-flex items-center gap-1.5", className)}>
	{@render children()}
</li>

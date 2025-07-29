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

<ol class={cn("flex w-max flex-wrap items-center break-words text-sm text-muted-foreground sm:gap-1.5", className)}>
	{@render children()}
</ol>

<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	let { 
		class: className,
		href,
		children
	}: {
		class?: string;
		href: string;
		children: Snippet;
	} = $props();
</script>

<a 
	{href}
	class={cn("transition-colors hover:text-foreground", className)}
>
	{@render children()}
</a>

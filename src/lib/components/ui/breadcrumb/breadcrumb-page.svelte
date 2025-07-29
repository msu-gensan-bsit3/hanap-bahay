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

<span 
	role="link"
	aria-disabled="true"
	aria-current="page"
	class={cn("font-normal text-foreground", className)}
>
	{@render children()}
</span>

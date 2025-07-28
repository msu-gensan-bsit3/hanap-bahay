<script lang="ts">
	import { cn } from "$lib/utils";
	import { ChevronRight } from "@lucide/svelte";

	let { 
		class: className
	}: {
		class?: string;
	} = $props();
</script>

<li role="presentation" aria-hidden="true" class={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}>
	<ChevronRight />
</li>

<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	interface Props {
		class?: string;
		children: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<nav aria-label="breadcrumb" class={cn("", className)}>
	<ol
		class="flex w-max flex-wrap items-center text-sm break-words text-muted-foreground sm:gap-1.5"
	>
		{@render children()}
	</ol>
</nav>

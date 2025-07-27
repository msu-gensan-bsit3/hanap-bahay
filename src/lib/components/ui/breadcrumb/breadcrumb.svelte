<!-- <script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	let { 
		class: className,
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props(); -->
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
		class="flex w-max flex-wrap items-center break-words text-sm text-muted-foreground sm:gap-1.5"
	>
		{@render children()}
	</ol>
</nav>

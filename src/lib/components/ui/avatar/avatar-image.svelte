<script lang="ts">
	import { cn } from "$lib/utils";

	type Props = {
		src?: string;
		alt?: string;
		class?: string;
	};

	let { src, alt, class: className, ...restProps }: Props = $props();
</script>

{#if src}
	<img
		{src}
		{alt}
		class={cn("aspect-square h-full w-full", className)}
		referrerpolicy="no-referrer"
		{...restProps}
	/>
{/if}

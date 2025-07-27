<script lang="ts">
	import { cn } from "$lib/utils";
	
	type Props = {
		class?: string;
		children?: any;
	};
	
	let { class: className, children, ...restProps }: Props = $props();
</script>

<div
	class={cn(
		"flex h-full w-full items-center justify-center rounded-full bg-muted",
		className
	)}
	{...restProps}
>
	{@render children()}
</div>

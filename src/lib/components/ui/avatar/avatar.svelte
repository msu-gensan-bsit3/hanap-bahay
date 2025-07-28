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
		"relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
		className
	)}
	{...restProps}
>
	{@render children()}
</div>

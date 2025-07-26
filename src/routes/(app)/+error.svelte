<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/state";

	let header: HTMLElement | null;
	let footer: HTMLElement | null;

	onMount(() => {
		header = document.querySelector("header");
		footer = document.querySelector("footer");
	});
</script>

<div
	class="flex w-full items-center justify-center"
	style="height: calc(100vh - {header?.clientHeight ?? 0}px - {footer?.clientHeight || 0}px);"
>
	<p class="text-4xl">
		{page.status}: {page.error?.message}
	</p>
</div>

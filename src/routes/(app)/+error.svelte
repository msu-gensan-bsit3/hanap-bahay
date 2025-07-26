<script lang="ts">
	import { page } from "$app/state";
	import { heights } from "$lib/states/heights.svelte";
</script>

<div
	class="flex w-full items-center justify-center"
	style="height: calc(100vh - {heights.header + heights.footer}px);"
>
	<p class="text-4xl">
		{page.status}: {page.error?.message}
	</p>
</div>

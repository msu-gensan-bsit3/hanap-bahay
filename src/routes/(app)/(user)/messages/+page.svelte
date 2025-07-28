<script lang="ts">
	import { page } from "$app/state";
	import { MessagePage } from "$lib/components/messages";
	import { heights } from "$lib/states/heights.svelte";
	import { hideFooter } from "$lib/utils";

	let { data } = $props();

	const convId = Number(page.url.searchParams.get("convId"));

	hideFooter();
</script>

<svelte:head>
	<title>Messages - JuanHome</title>
</svelte:head>

<div
	class="@container flex gap-6 p-4"
	style="height: calc(100dvh - {heights.header + heights.breadcrumbs + 2}px);"
>
	<MessagePage {...data} role="user" convIdParam={convId} />
</div>

<script lang="ts">
	import { page } from "$app/state";
	import { MessagePage } from "$lib/components/messages";
	import { heights } from "$lib/states/heights.svelte";
	import { hideFooter } from "$lib/utils";

	let { data } = $props();

	hideFooter();
</script>

<svelte:head>
	<title>Messages - JuanHome</title>
</svelte:head>

<div class="@container flex gap-6 p-4" style="height: calc(100dvh - {heights.header + 1}px);">
	<MessagePage
		userConversations={data.userConversations}
		userId={data.userId}
		convIdParam={Number(page.url.searchParams.get("convId"))}
	/>
</div>

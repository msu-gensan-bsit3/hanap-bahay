<script lang="ts">
	import { MessagePage } from "$lib/components/messages-agents";

	let { data } = $props();
</script>

<svelte:head>
	<title>Messages - JuanHome Agent Dashboard</title>
</svelte:head>

<div class="flex h-[calc(100dvh-6rem-1px)] gap-6 lg:h-[calc(100dvh-2rem)]">
	<MessagePage {...data} role="agent" />
</div>

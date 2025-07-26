<script lang="ts">
	import { page } from "$app/state";
	import { ConversationsList, ChatArea, QuickActions } from "$lib/components/messages";
	import { heights } from "$lib/states/heights.svelte";
	import { formatTimeAgo, hideFooter } from "$lib/utils";

	let { data } = $props();

	let sender = $derived(
		data.userConversations.at(0)?.participants.find((v) => v.user.id === data.userId),
	);
	let senderName = $derived(sender?.user.firstName + " " + sender?.user.lastName);

	let conversations = $derived(
		data.userConversations.map((v) => {
			const receiver = v.participants.filter((v) => v.user.id !== data.userId)[0];
			const s = v.participants.find((v) => v.user.id === data.userId);

			const lastMessageObject = v.messages.at(v.messages.length - 1);

			const id = v.id;
			const name = receiver.user.firstName + " " + receiver.user.lastName;
			const lastMessage = lastMessageObject?.content;
			const timestamp = lastMessageObject?.updatedAt
				? formatTimeAgo(new Date(lastMessageObject.updatedAt))
				: "";

			const unread = v.messages.filter(
				(msg) => s?.lastReadAt && msg.updatedAt && new Date(msg.updatedAt) > new Date(s.lastReadAt),
			).length;

			const avatar = receiver.user.profilePicture || "/no-profile.jpg";
			const online = false;
			const properties = v.offerConversations.map((o) => o.offer.listing.property);

			return {
				id,
				name,
				lastMessage,
				timestamp,
				unread,
				avatar,
				online,
				properties,
			};
		}),
	);

	// svelte-ignore state_referenced_locally
	let convId = $state(Number(page.url.searchParams.get("convId")) || conversations?.at(0)?.id);
	let selectedConversation = $derived(conversations?.find((v) => v.id === convId));

	let messages = $derived(
		data.userConversations
			.find((v) => v.id === selectedConversation?.id)
			?.messages.map((v) => {
				return {
					id: v.id,
					senderId: v.senderId,
					senderName:
						v.senderId === selectedConversation?.id ? selectedConversation?.name : senderName,
					content: v.content,
					timestamp: formatTimeAgo(v.updatedAt),
				};
			}) || [],
	);

	let showConversations = $state(true);
	let showChat = $state(false);
	let messagesContainer: HTMLElement | undefined = $state();

	function selectConversation(conversation: (typeof conversations)[0]) {
		selectedConversation = conversation;
		// Mark as read
		conversation.unread = 0;

		showConversations = false;
		showChat = true;
	}

	function backToConversations() {
		showConversations = true;
		showChat = false;
	}

	function sendMessage(messageContent: string) {
		const now = new Date();
		const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

		// Update last message in conversation
		selectedConversation!.lastMessage = messageContent;
		selectedConversation!.timestamp = "now";

		// Scroll to bottom after sending
		setTimeout(scrollToBottom, 100);
	}

	function handleQuickResponse(message: string) {
		sendMessage(message);
	}

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });
		}
	}

	hideFooter();
</script>

<svelte:head>
	<title>Messages - JuanHome</title>
</svelte:head>

<div class="@container flex gap-6 p-4" style="height: calc(100dvh - {heights.header + 1}px);">
	{#if conversations.length === 0}
		<div class="flex w-full flex-col items-center justify-center gap-4 text-center">
			<h2 class="text-2xl font-bold">No conversations yet</h2>
			<p class="text-muted-foreground">Start a conversation with an agent to see it here.</p>
		</div>
	{:else}
		<!-- Mobile: Show conversations or chat based on state -->
		<div class="w-full flex-1 @4xl:hidden">
			{#if showConversations}
				<ConversationsList
					{conversations}
					{selectedConversation}
					onSelectConversation={selectConversation}
					isMobile={true}
				/>
			{:else if showChat}
				<ChatArea
					userId={1}
					{messages}
					{selectedConversation}
					onSendMessage={sendMessage}
					onBack={backToConversations}
					isMobile={true}
					bind:messagesContainer
				/>
			{/if}
		</div>

		<!-- Desktop: Show all panels side by side -->
		<div class="hidden @4xl:flex @4xl:flex-1 @4xl:gap-4">
			<!-- Conversations Sidebar -->
			<ConversationsList
				{conversations}
				{selectedConversation}
				onSelectConversation={selectConversation}
				isMobile={false}
			/>

			<!-- Chat Area -->
			<ChatArea
				{messages}
				{selectedConversation}
				onSendMessage={sendMessage}
				isMobile={false}
				bind:messagesContainer
			/>

			<!-- Quick Actions Sidebar -->
			<QuickActions {selectedConversation} onQuickResponse={handleQuickResponse} />
		</div>
	{/if}
</div>

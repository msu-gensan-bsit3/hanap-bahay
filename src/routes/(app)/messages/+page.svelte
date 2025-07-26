<script lang="ts">
	import { page } from "$app/state";
	import { ConversationsList, ChatArea, QuickActions } from "$lib/components/messages";
	import { heights } from "$lib/states/heights.svelte";
	import { hideFooter } from "$lib/utils";

	let { data } = $props();

	// Sample data for conversations from a user's perspective (conversing with agents)
	function formatTimeAgo(date: Date): string {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffMins < 1) return "now";
		if (diffMins < 60) return `${diffMins} min ago`;
		if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
		return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
	}

	let sender = $derived(
		data.userConversation.at(0)?.conversation.participants.find((v) => v.user.id === data.userId),
	);
	let senderName = $derived(sender?.user.firstName + " " + sender?.user.lastName);

	let conversations = $derived(
		data.userConversation.map((v) => {
			const receiver = v.conversation.participants.filter((v) => v.id !== data.userId)[0];

			const lastMessageObject = v.conversation.messages.at(v.conversation.messages.length - 1);

			const id = v.conversation.id;
			const name = receiver.user.firstName + " " + receiver.user.lastName;
			const lastMessage = lastMessageObject?.content;
			const timestamp = lastMessageObject?.updatedAt
				? formatTimeAgo(new Date(lastMessageObject.updatedAt))
				: "";

			const unread = v.conversation.messages.filter(
				(msg) => v.lastReadAt && msg.updatedAt && new Date(msg.updatedAt) > new Date(v.lastReadAt),
			).length;

			const avatar = receiver.user.profilePicture || "/no-profile.jpg";
			const online = false;
			const property = v.conversation.offer?.listing.property.name;

			return {
				id,
				name,
				lastMessage,
				timestamp,
				unread,
				avatar,
				online,
				property,
			};
		}),
	);

	let messages = $derived(
		data.userConversation
			.find((v) => v.conversation.id === selectedConversation?.id)
			?.conversation.messages.map((v) => {
				return {
					id: v.id,
					senderId: v.senderId,
					senderName:
						v.senderId === selectedConversation?.id ? selectedConversation?.name : senderName,
					content: v.content,
					timestamp: formatTimeAgo(v.updatedAt),
				};
			})||[],
	);

	// svelte-ignore state_referenced_locally
	let convId = $state(Number(page.url.searchParams.get("convId")) || conversations.at(0)?.id);
	let selectedConversation = $derived(conversations.find((v) => v.id === convId));

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
</div>

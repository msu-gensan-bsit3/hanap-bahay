<script lang="ts">
	import { invalidate, replaceState } from "$app/navigation";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { formatTimeAgo } from "$lib/utils";
	import { onMount, tick } from "svelte";
	import { source, type Source } from "sveltekit-sse";
	import { ChatArea, ConversationsList, QuickActions } from ".";
	import type { PageServerData } from "../../../routes/(app)/(user)/messages/$types";

	interface props {
		userConversations: PageServerData["userConversations"];
		userId: number;
		convIdParam?: number;
		role: "user" | "agent";
	}

	let { userConversations, userId, convIdParam, role }: props = $props();

	let sender = $derived(userConversations.at(0)?.participants.find((v) => v.user.id === userId));
	let senderName = $derived(sender?.user.firstName + " " + sender?.user.lastName);

	let conversations = $derived(
		userConversations.map((v) => {
			const receiver = v.participants.filter((v) => v.user.id !== userId)[0];
			const s = v.participants.find((v) => v.user.id === userId);

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
			const properties = v.offerConversations.map((o) => ({
				...o.offer.listing.property,
				listingId: o.offer.listing.id,
			}));

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
	let convId = $state(convIdParam || conversations?.at(0)?.id);
	let selectedConversation = $derived(conversations?.find((v) => v.id === convId));

	onMount(async () => {
		if (!selectedConversation) {
			await tick();
			replaceState(window.location.pathname, {});
		}
	});

	onMount(() => {
		const sources: Source[] = [];
		conversations.forEach((v) => {
			const mSource = source("/events/messaging/" + v.id);

			mSource.select(`messaging-${v.id}`).subscribe(() => {
				invalidate("message");
			});

			sources.push(mSource);
		});
		return () => {
			sources.forEach((v) => v.close());
		};
	});

	let messages = $derived(
		userConversations
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
		if (selectedConversation) {
			selectedConversation = { ...selectedConversation, unread: 0 };
		}

		convId = conversation.id;
		tick().then(() => {
			if (selectedConversation?.unread) {
				updateTimeBtn?.click();
			}
		});

		// Mark as read
		conversation.unread = 0;

		const url = new URL(window.location.href);
		url.searchParams.set("convId", String(convId));
		replaceState(url.href, {});

		showConversations = false;
		showChat = true;
	}

	function backToConversations() {
		showConversations = true;
		showChat = false;
	}

	function sendMessage(messageContent: string) {
		messages = [
			...messages,
			{
				content: messageContent,
				id: (messages.at(messages.length - 1)?.id || 0) + 1,
				senderId: userId,
				senderName,
				timestamp: "sending",
			},
		];

		message = messageContent;

		tick().then(() => {
			submitButton?.click();
			message = "";
		});
	}

	let message = $state("");

	function handleQuickResponse(message: string) {
		sendMessage(message);
	}

	let submitButton: HTMLElement | undefined = $state();
	const sendMessageForm = moreEnhance();
	const { enhance: sendMessageEnhance } = $derived(sendMessageForm);

	let updateTimeBtn: HTMLElement | undefined = $state();
	const updateReadTimeForm = moreEnhance();
	const { enhance: updateReadTimeEnhance } = $derived(updateReadTimeForm);
</script>

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
			{userId}
			{role}
			{selectedConversation}
			{messages}
			onSendMessage={sendMessage}
			onBack={backToConversations}
			isMobile={true}
			sending={sendMessageForm.submitting}
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
		{userId}
		{role}
		{selectedConversation}
		{messages}
		sending={sendMessageForm.submitting}
		onSendMessage={sendMessage}
		isMobile={false}
		bind:messagesContainer
	/>

	<!-- Quick Actions Sidebar -->
	<QuickActions
		properties={selectedConversation?.properties}
		onQuickResponse={handleQuickResponse}
		{role}
	/>
</div>

<form action="?/sendMessage" method="post" class="hidden" use:sendMessageEnhance>
	<input type="hidden" name="convId" value={convId} required />
	<input type="hidden" name="message" value={message} required />
	<button bind:this={submitButton} aria-label="submit"></button>
</form>

<form action="?/updateReadTime" method="post" class="hidden" use:updateReadTimeEnhance>
	<input type="hidden" name="convId" value={convId} required />
	<button bind:this={updateTimeBtn} aria-label="submit"></button>
</form>

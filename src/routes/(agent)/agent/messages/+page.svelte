<script lang="ts">
	import {
		ConversationsList,
		ChatArea,
		QuickActions,
		MobileQuickActions,
	} from "$lib/components/messages";
	import { getContext } from "svelte";

	// Sample data for conversations
	let conversations = $state([
		{
			id: 1,
			name: "Maria Santos",
			lastMessage: "I'm interested in the 3BR condo in Makati. Can we schedule a viewing?",
			timestamp: "2 min ago",
			unread: 2,
			avatar: "/no-profile.jpg",
			online: true,
			property: "Luxury Condo in Makati",
		},
		{
			id: 2,
			name: "Juan Dela Cruz",
			lastMessage: "What's the monthly association fee for the BGC unit?",
			timestamp: "15 min ago",
			unread: 0,
			avatar: "/no-profile.jpg",
			online: false,
			property: "Studio Unit in BGC",
		},
		{
			id: 3,
			name: "Ana Rodriguez",
			lastMessage: "Thank you for the detailed information. I'll get back to you soon.",
			timestamp: "1 hour ago",
			unread: 0,
			avatar: "/no-profile.jpg",
			online: false,
			property: "House and Lot in Alabang",
		},
		{
			id: 4,
			name: "Carlos Mendoza",
			lastMessage: "Is the property still available? I'd like to make an offer.",
			timestamp: "3 hours ago",
			unread: 1,
			avatar: "/no-profile.jpg",
			online: true,
			property: "Townhouse in Quezon City",
		},
		{
			id: 5,
			name: "Sofia Reyes",
			lastMessage: "Could you send me more photos of the kitchen and bathroom?",
			timestamp: "1 day ago",
			unread: 0,
			avatar: "/no-profile.jpg",
			online: false,
			property: "2BR Apartment in Pasig",
		},
		{
			id: 6,
			name: "Sofia Reyes",
			lastMessage: "Could you send me more photos of the kitchen and bathroom?",
			timestamp: "1 day ago",
			unread: 0,
			avatar: "/no-profile.jpg",
			online: false,
			property: "2BR Apartment in Pasig",
		},
		{
			id: 7,
			name: "Sofia Reyes",
			lastMessage: "Could you send me more photos of the kitchen and bathroom?",
			timestamp: "1 day ago",
			unread: 0,
			avatar: "/no-profile.jpg",
			online: false,
			property: "2BR Apartment in Pasig",
		},
		{
			id: 8,
			name: "Sofia Reyes",
			lastMessage: "Could you send me more photos of the kitchen and bathroom?",
			timestamp: "1 day ago",
			unread: 0,
			avatar: "/no-profile.jpg",
			online: false,
			property: "2BR Apartment in Pasig",
		},
		{
			id: 9,
			name: "Sofia Reyes",
			lastMessage: "Could you send me more photos of the kitchen and bathroom?",
			timestamp: "1 day ago",
			unread: 0,
			avatar: "/no-profile.jpg",
			online: false,
			property: "2BR Apartment in Pasig",
		},
	]);

	// Sample messages for the selected conversation
	let selectedConversation = $state(conversations[0]);
	let messages = $derived([
		{
			id: 1,
			senderId: selectedConversation.id,
			senderName: selectedConversation.name,
			content:
				"Hi! I saw your listing for the 3BR condo in Makati. Could you tell me more about it?",
			timestamp: "10:30 AM",
			isAgent: false,
		},
		{
			id: 2,
			senderId: "agent",
			senderName: "You",
			content:
				"Hello Maria! Thank you for your interest. The condo is located in a prime area with great amenities. It has 3 bedrooms, 2 bathrooms, and 140 sqm of living space. Would you like to know about specific features?",
			timestamp: "10:35 AM",
			isAgent: true,
		},
		{
			id: 3,
			senderId: selectedConversation.id,
			senderName: selectedConversation.name,
			content: "That sounds perfect! What are the building amenities? And is parking included?",
			timestamp: "10:37 AM",
			isAgent: false,
		},
		{
			id: 4,
			senderId: "agent",
			senderName: "You",
			content:
				"Great questions! The building has a swimming pool, gym, function room, and 24/7 security. Yes, it comes with 2 covered parking slots. The building also has a rooftop garden and children's playground.",
			timestamp: "10:40 AM",
			isAgent: true,
		},
		{
			id: 5,
			senderId: selectedConversation.id,
			senderName: selectedConversation.name,
			content: "I'm interested in the 3BR condo in Makati. Can we schedule a viewing?",
			timestamp: "10:45 AM",
			isAgent: false,
		},
	]);

	let showConversations = $state(true);
	let showChat = $state(false);
	let messagesContainer: HTMLElement | undefined = $state();

	function selectConversation(conversation: (typeof conversations)[0]) {
		selectedConversation = conversation;
		// Mark as read
		conversation.unread = 0;
		// In a real app, you'd fetch messages for this conversation

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

		messages = [
			...messages,
			{
				id: messages.length + 1,
				senderId: "agent",
				senderName: "You",
				content: messageContent,
				timestamp,
				isAgent: true,
			},
		];

		// Update last message in conversation
		selectedConversation.lastMessage = messageContent;
		selectedConversation.timestamp = "now";

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
</script>

<svelte:head>
	<title>Messages - JuanHome Agent Dashboard</title>
</svelte:head>

<div class="flex max-h-[calc(100dvh-6rem-1px)] gap-6 lg:max-h-[calc(100dvh-2rem)]">
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
				{selectedConversation}
				{messages}
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
			{selectedConversation}
			{messages}
			onSendMessage={sendMessage}
			isMobile={false}
			bind:messagesContainer
		/>

		<!-- Quick Actions Sidebar -->
		<QuickActions {selectedConversation} onQuickResponse={handleQuickResponse} />
	</div>
</div>

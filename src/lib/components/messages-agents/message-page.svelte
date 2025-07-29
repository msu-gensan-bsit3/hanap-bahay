<script lang="ts">
	import { invalidate, replaceState } from "$app/navigation";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { formatTimeAgo } from "$lib/utils";
	import { onMount, tick } from "svelte";
	import { source, type Source } from "sveltekit-sse";
	import { ChatArea, QuickActions } from ".";
	import type { LayoutServerData } from "../../../routes/(agent)/$types";
	import type { PageServerData } from "../../../routes/(agent)/agent/messages/$types";
	import TabbedConversationsList from "./tabbed-conversations-list.svelte";

	interface props {
		userConversations: PageServerData["userConversations"];
		propertyDetails: PageServerData["propertyDetails"];
		listings: LayoutServerData["listings"];
		userId: number;
		convIdParam?: number;
		role: "user" | "agent";
	}

	let { userConversations, propertyDetails, userId, convIdParam, role, listings }: props = $props();

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

			const agentId = sender!.id;

			return {
				id,
				name,
				agentId,
				lastMessage,
				timestamp,
				unread,
				avatar,
				online,
				properties,
				receiverId: receiver.user.id, // Add receiver ID for buyer/seller determination
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

	// Get property images for the selected conversation
	let propertyImages = $derived.by(() => {
		if (!selectedConversation || !propertyDetails) return {};

		const imagesMap: Record<number, string[]> = {};

		selectedConversation.properties.forEach((property) => {
			const propertyDetail = propertyDetails.find((detail) => detail.property.id === property.id);

			if (propertyDetail?.property.photosUrl?.length) {
				imagesMap[property.id] = propertyDetail.property.photosUrl.map((photo) => photo.url);
			}
		});

		return imagesMap;
	});

	// Get property locations for the selected conversation
	let propertyLocations = $derived.by(() => {
		if (!selectedConversation || !propertyDetails) return {};

		const locationsMap: Record<number, string> = {};

		selectedConversation.properties.forEach((property) => {
			const propertyDetail = propertyDetails.find((detail) => detail.property.id === property.id);

			if (propertyDetail?.property.address) {
				const address = propertyDetail.property.address;
				const locationParts = [
					address.street,
					address.barangay,
					address.city,
					address.province,
				].filter(Boolean);

				locationsMap[property.id] = locationParts.join(", ");
			}
		});

		return locationsMap;
	});

	let showConversations = $state(true);
	let showChat = $state(false);
	let messagesContainer: HTMLElement | undefined = $state();

	function selectConversation(conversation: (typeof conversations)[0]) {
		if (selectedConversation) {
			selectedConversation = { ...selectedConversation, unread: 0 };
		}

		convId = conversation.id;
		tick().then(() => {
			updateTimeBtn?.click();
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

	let approveListingBtn: HTMLElement | undefined = $state();
	const approveListingForm = moreEnhance();
	const { enhance: approveListingEnhance } = $derived(approveListingForm);

	let markSoldBtn: HTMLElement | undefined = $state();
	const markSoldForm = moreEnhance();
	const { enhance: markSoldEnhance } = $derived(markSoldForm);

	let listingIdToApprove = $state<number | undefined>();
	let offerIdToMarkSold = $state<number | undefined>();
	let listingIdToMarkSold = $state<number | undefined>();

	function handleApproveListing(listingId: number) {
		listingIdToApprove = listingId;
		tick().then(() => {
			approveListingBtn?.click();
			// Send a message about the approval
			handleQuickResponse(
				"✅ Great news! I've approved your property listing. It's now live and available for buyers to view. You should start receiving inquiries soon!",
			);
		});
	}

	function handleMarkSold(offerId: number, listingId: number) {
		offerIdToMarkSold = offerId;
		listingIdToMarkSold = listingId;
		tick().then(() => {
			markSoldBtn?.click();
			// Send a message about the sale completion
			// handleQuickResponse(
			// 	"🎉 Congratulations! I've marked this property as sold. The transaction has been completed successfully. Thank you for choosing our services!",
			// );
		});
	}

	// Get conversation data for the selected conversation
	let conversationData = $derived.by(() => {
		if (!selectedConversation) return {};

		const conversation = userConversations.find((v) => v.id === selectedConversation?.id);
		if (!conversation) return {};

		// Get listing status from the first offer conversation
		const firstOfferConversation =
			conversation.offerConversations[conversation.offerConversations.length - 1];
		const listingStatus = firstOfferConversation?.offer?.listing?.status;

		// Get all offer IDs for this conversation
		const offerIds = conversation.offerConversations.map((oc) => oc.offer?.id).filter(Boolean);

		return {
			listingStatus,
			offerIds,
		};
	});

	// Determine if the conversation participant is a buyer or seller
	let participantRole: "buyer" | "seller" = $derived.by(() => {
		if (!selectedConversation) return "buyer";

		// Check if any property in this conversation has sellerId matching the receiver
		// If sellerId matches the receiver, then it's a seller conversation (agent talking to property owner)
		// Otherwise, it's a buyer conversation (agent talking to someone interested in buying)

		let isSeller = false;
		for (const l of listings) {
			if (selectedConversation!.receiverId === l.property.sellerId) {
				isSeller = true;
				break;
			}
		}

		return isSeller ? "seller" : "buyer";
	});

	function isSeller(id: number) {
		if (!selectedConversation) return false;

		// Check if any property in this conversation has sellerId matching the receiver
		// If sellerId matches the receiver, then it's a seller conversation (agent talking to property owner)
		// Otherwise, it's a buyer conversation (agent talking to someone interested in buying)

		let isSeller = false;
		for (const l of listings) {
			if (id === l.property.sellerId) {
				isSeller = true;
				break;
			}
		}

		return isSeller;
	}
</script>

<div class="w-full flex-1 @4xl:hidden">
	{#if showConversations}
		<TabbedConversationsList
			{conversations}
			{selectedConversation}
			onSelectConversation={selectConversation}
			isMobile={true}
			{userId}
			{isSeller}
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
	<TabbedConversationsList
		{isSeller}
		{conversations}
		{selectedConversation}
		onSelectConversation={selectConversation}
		isMobile={false}
		{userId}
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
		{participantRole}
		{propertyImages}
		{propertyLocations}
		onApproveListing={handleApproveListing}
		onMarkSold={handleMarkSold}
		{conversationData}
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

<form action="?/approveListing" method="post" class="hidden" use:approveListingEnhance>
	<input type="hidden" name="listingId" value={listingIdToApprove} required />
	<button bind:this={approveListingBtn} aria-label="approve listing"></button>
</form>

<form action="?/markOfferSold" method="post" class="hidden" use:markSoldEnhance>
	<input type="hidden" name="offerId" value={offerIdToMarkSold} required />
	<input type="hidden" name="listingId" value={listingIdToMarkSold} required />
	<button bind:this={markSoldBtn} aria-label="mark as sold"></button>
</form>

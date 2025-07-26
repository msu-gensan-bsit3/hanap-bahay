<script lang="ts">
	import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";

	interface props {
		selectedConversation: {
			id: number;
			name: string;
			avatar: string;
			online: boolean;
			property: string;
			timestamp: string;
		};
		messages: Array<{
			id: number;
			senderId: number | string;
			senderName: string;
			content: string;
			timestamp: string;
			isAgent: boolean;
		}>;
		onSendMessage: (message: string) => void;
		onBack?: () => void;
		isMobile?: boolean;
	}

	let {
		selectedConversation,
		messages,
		onSendMessage,
		onBack = () => {},
		isMobile = false,
	}: props = $props();

	let newMessage = $state("");
	let messagesContainer: HTMLElement | undefined = $state();

	function sendMessage() {
		if (newMessage.trim()) {
			onSendMessage(newMessage.trim());
			newMessage = "";

			// Scroll to bottom after sending
			setTimeout(scrollToBottom, 100);
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: "smooth" });
		}
	}
</script>

<div class="flex h-full flex-1 flex-col">
	<Card class="flex h-full flex-col">
		<!-- Chat Header -->
		<CardHeader class="border-b pb-4">
			<div class="flex items-center gap-3">
				{#if isMobile && onBack}
					<Button variant="ghost" size="icon" onclick={onBack} class="shrink-0">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</Button>
				{/if}
				<div class="relative">
					<img
						src={selectedConversation.avatar}
						alt={selectedConversation.name}
						class="h-10 w-10 rounded-full object-cover"
					/>
					{#if selectedConversation.online}
						<div
							class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"
						></div>
					{/if}
				</div>
				<div class="min-w-0 flex-1">
					<h2 class="truncate font-semibold text-gray-900">{selectedConversation.name}</h2>
					<p class="truncate text-sm font-medium text-blue-600">{selectedConversation.property}</p>
					<p class="text-xs text-gray-500">
						{selectedConversation.online ? "Online" : "Last seen " + selectedConversation.timestamp}
					</p>
				</div>
				<div class="flex gap-2">
					<!-- TODO: Copy phone number -->
					<Button variant="outline" size="sm" class="hidden sm:flex">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<span class="ml-1 hidden lg:inline">Call</span>
					</Button>
					<Button variant="outline" size={isMobile ? "icon" : "sm"}>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{#if !isMobile}<span class="ml-1 hidden lg:inline">Info</span>{/if}
					</Button>
					{#if isMobile}
						<Button variant="outline" size="icon">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</Button>
					{/if}
				</div>
			</div>
		</CardHeader>

		<!-- Messages Area -->
		<CardContent class="flex-1 overflow-y-auto p-3  lg:p-4">
			<div bind:this={messagesContainer} class="h-full space-y-3 overflow-y-auto lg:space-y-4">
				{#each messages as message (message.id)}
					<div class="flex {message.isAgent ? 'justify-end' : 'justify-start'}">
						<div class="max-w-[280px] sm:max-w-xs lg:max-w-md">
							{#if !message.isAgent}
								<div class="flex items-end gap-2">
									<img
										src={selectedConversation.avatar}
										alt={selectedConversation.name}
										class="h-6 w-6 flex-shrink-0 rounded-full object-cover"
									/>
									<div class="min-w-0">
										<div class="rounded-2xl bg-gray-100 px-3 py-2 lg:px-4">
											<p class="text-sm break-words text-gray-900">{message.content}</p>
										</div>
										<p class="mt-1 text-xs text-gray-500">{message.timestamp}</p>
									</div>
								</div>
							{:else}
								<div class="flex items-end justify-end gap-2">
									<div class="min-w-0">
										<div class="rounded-2xl bg-blue-600 px-3 py-2 lg:px-4">
											<p class="text-sm break-words text-white">{message.content}</p>
										</div>
										<p class="mt-1 text-right text-xs text-gray-500">{message.timestamp}</p>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</CardContent>

		<!-- Message Input -->
		<div class="border-t p-3 lg:p-4">
			<div class="flex gap-2 lg:gap-3">
				<Button variant="outline" size="icon" class="hidden shrink-0 sm:flex">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
						/>
					</svg>
				</Button>
				<div class="flex-1">
					<Input
						type="text"
						placeholder="Type your message..."
						bind:value={newMessage}
						onkeypress={handleKeyPress}
						class="w-full text-base lg:text-sm"
					/>
				</div>
				<Button onclick={sendMessage} disabled={!newMessage.trim()} class="shrink-0">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
						/>
					</svg>
					<span class="ml-1 hidden sm:inline">Send</span>
				</Button>
			</div>
		</div>
	</Card>
</div>

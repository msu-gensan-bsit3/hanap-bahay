<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import type { Property } from "$lib/server/db/schema";
	import { Info, LoaderCircle, Paperclip, Phone, Send } from "@lucide/svelte";
	import { tick } from "svelte";
	import { MobileQuickActions } from ".";

	interface props {
		selectedConversation?: {
			id: number;
			name: string;
			avatar: string;
			online: boolean;
			properties: (Property & { listingId: number })[];
			timestamp: string;
		};
		messages: Array<{
			id: number;
			senderId: number | string;
			senderName: string;
			content: string;
			timestamp: string;
		}>;
		userId: number;
		onSendMessage: (message: string) => void;
		onBack?: () => void;
		isMobile?: boolean;
		messagesContainer?: HTMLElement;
		sending?: boolean;
		role: "agent" | "user";
	}

	let {
		selectedConversation,
		messages,
		userId,
		onSendMessage,
		onBack = () => {},
		isMobile = false,
		messagesContainer = $bindable(),
		sending,
		role,
	}: props = $props();

	let newMessage = $state("");

	function sendMessage() {
		if (newMessage.trim()) {
			onSendMessage(newMessage.trim());
			newMessage = "";
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function handleQuickResponse(message: string) {
		onSendMessage(message);
	}

	$effect(() => {
		messages;
		tick().then(() => {
			scrollToBottom();
		});
	});

	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: "instant",
			});
		}
	}

	const lastMessageReceiver = $derived(messages.findLast((v) => v.senderId !== userId)?.timestamp);
</script>

<div class="flex h-full flex-1 flex-col">
	{#if selectedConversation}
		<Card class="flex h-full flex-col py-0 pt-4">
			<!-- Chat Header -->
			<CardHeader class="border-b pb-4">
				<div class="flex w-full items-center gap-3">
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
					<div class="w-full min-w-0 flex-1">
						<h2 class="truncate font-semibold text-gray-900">{selectedConversation.name}</h2>
						<p class="line-clamp-1 text-sm font-medium text-ellipsis text-blue-600">
							{selectedConversation.properties?.at(0)?.name}
						</p>
						<p class="text-xs text-gray-500">
							{selectedConversation.online
								? "Online"
								: lastMessageReceiver
									? "Last seen " + lastMessageReceiver
									: ""}
						</p>
					</div>
					<div class="flex gap-2">
						<!-- TODO: Copy phone number -->
						<Button variant="outline" size="sm" class="hidden sm:flex">
							<Phone />
							<span class="ml-1 hidden lg:inline">Call</span>
						</Button>
						<Button variant="outline" size="sm">
							<Info />
							<span class="ml-1 hidden lg:inline">Info</span>
						</Button>
					</div>
				</div>
			</CardHeader>

			<!-- Messages Area -->
			<CardContent class="relative flex-1 overflow-y-auto  p-3 lg:p-4">
				<div bind:this={messagesContainer} class="h-full space-y-3 overflow-y-auto lg:space-y-4">
					{#each messages as message (message.id)}
						<div class="flex {message.senderId === userId ? 'justify-end' : 'justify-start'}">
							<div class="max-w-[280px] sm:max-w-xs lg:max-w-md">
								{#if message.senderId !== userId}
									<div class="flex items-center gap-2">
										<img
											src={selectedConversation.avatar}
											alt={selectedConversation.name}
											class="h-6 w-6 flex-shrink-0 rounded-full object-cover"
										/>
										<div class="min-w-0">
											<div class="rounded-2xl bg-gray-100 px-3 py-2 lg:px-4">
												<p class="text-sm break-words text-gray-900">{message.content}</p>
											</div>
										</div>
									</div>
									<p class="mt-1 text-xs text-gray-500">{message.timestamp}</p>
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
				<div class="relative {isMobile ? '@4xl:hidden' : '@7xl:hidden'}">
					<MobileQuickActions
						{role}
						properties={selectedConversation.properties}
						onQuickResponse={handleQuickResponse}
					/>
				</div>
			</CardContent>

			<!-- Message Input -->
			<div class="border-t p-3 lg:p-4">
				<div class="flex gap-2 lg:gap-3">
					<Button variant="outline" size="icon" class="hidden shrink-0 sm:flex">
						<Paperclip />
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
						{#if sending}
							<LoaderCircle class="animate-spin" />
						{:else}
							<Send />
						{/if}
						<span class="ml-1 hidden sm:inline">Send</span>
					</Button>
				</div>
			</div>
		</Card>
	{/if}
</div>

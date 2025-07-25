<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Badge } from "$lib/components/ui/badge";

	interface props {
		conversations: {
			id: number;
			name: string;
			lastMessage: string;
			timestamp: string;
			unread: number;
			avatar: string;
			online: boolean;
			property: string;
		}[];
	}
	interface props {
		selectedConversation: props["conversations"][0];
		onSelectConversation: (conversation: props["conversations"][0]) => void;
		isMobile: boolean;
	}
	let {
		conversations,
		selectedConversation,
		onSelectConversation,
		isMobile = false,
	}: props = $props();

	let searchQuery = $state("");

	let filteredConversations = $derived(
		conversations.filter(
			(conv) =>
				conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				conv.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
				conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
		),
	);

	let totalUnread = $derived(conversations.reduce((sum, conv) => sum + conv.unread, 0));
</script>

<div class="h-full {isMobile ? "w-full" : "flex w-85 flex-col"}">
	<Card class="flex h-full flex-col gap-0 py-0 pt-6">
		<CardHeader class="border-b pb-4">
			<div class="flex items-center justify-between">
				<CardTitle class="text-lg">Messages</CardTitle>
				{#if totalUnread > 0}
					<Badge variant="destructive" class="text-xs">
						{totalUnread} new
					</Badge>
				{/if}
			</div>
			<div class="mt-3">
				<Input
					type="text"
					placeholder="Search conversations..."
					bind:value={searchQuery}
					class="w-full"
				/>
			</div>
		</CardHeader>
		<CardContent class="flex-1 overflow-y-auto p-0">
			<div class="divide-y {!isMobile ? 'border-b' : ''}">
				{#each filteredConversations as conversation (conversation.id)}
					<button
						class="w-full p-4 text-left transition-colors hover:bg-gray-50 {selectedConversation.id ===
							conversation.id && !isMobile
							? 'border-r-2 border-blue-500 bg-blue-50'
							: ''} active:bg-gray-100"
						onclick={() => onSelectConversation(conversation)}
					>
						<div class="flex items-start gap-3">
							<div class="relative">
								<img
									src={conversation.avatar}
									alt={conversation.name}
									class="h-12 w-12 rounded-full object-cover lg:h-10 lg:w-10"
								/>
								{#if conversation.online}
									<div
										class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"
									></div>
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between">
									<h3 class="truncate text-base font-medium text-gray-900 lg:text-sm">
										{conversation.name}
									</h3>
									<div class="flex items-center gap-2">
										{#if conversation.unread > 0}
											<Badge
												variant="destructive"
												class="h-5 min-w-[1.25rem] px-1.5 py-0.5 text-xs"
											>
												{conversation.unread}
											</Badge>
										{/if}
										<span class="text-xs whitespace-nowrap text-gray-500"
											>{conversation.timestamp}</span
										>
									</div>
								</div>
								<p class="mb-1 truncate text-xs font-medium text-blue-600">
									{conversation.property}
								</p>
								<p class="truncate text-sm text-gray-600">
									{conversation.lastMessage}
								</p>
							</div>
							{#if isMobile}
								<div class="ml-2 flex items-center">
									<svg
										class="h-5 w-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</CardContent>
	</Card>
</div>

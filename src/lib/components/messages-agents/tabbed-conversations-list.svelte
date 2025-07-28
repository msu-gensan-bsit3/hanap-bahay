<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";
	import type { Property } from "$lib/server/db/schema";

	interface ConversationType {
		id: number;
		name: string;
		lastMessage: string | undefined;
		timestamp: string;
		unread: number;
		avatar: string;
		online: boolean;
		agentId: number;
		properties: (Property & { listingId: number })[];
		receiverId: number;
	}

	interface props {
		conversations: ConversationType[];
		selectedConversation?: ConversationType;
		onSelectConversation: (conversation: ConversationType) => void;
		isMobile: boolean;
		userId: number;
	}

	let {
		conversations,
		selectedConversation,
		onSelectConversation,
		isMobile = false,
		userId,
	}: props = $props();

	let searchQuery = $state("");
	let activeTab = $state<"buyers" | "sellers">("buyers");

	// Separate conversations based on whether the current user (agent) is talking to a buyer or seller
	let separatedConversations = $derived(() => {
		const buyers: ConversationType[] = [];
		const sellers: ConversationType[] = [];

		conversations.forEach((conv) => {
			// To determine if this is a buyer or seller conversation:
			// - Check if any property in this conversation has sellerId matching the receiver
			// - If sellerId matches the receiver, then it's a seller conversation (agent talking to property owner)
			// - Otherwise, it's a buyer conversation (agent talking to someone interested in buying)

			const isSeller = conv.properties.some((property) => property.sellerId === conv.receiverId);

			if (isSeller) {
				sellers.push(conv);
			} else {
				buyers.push(conv);
			}
		});

		return { buyerConversations: buyers, sellerConversations: sellers };
	});

	let buyerConversations = $derived(separatedConversations().buyerConversations);
	let sellerConversations = $derived(separatedConversations().sellerConversations);

	let filteredConversations = $derived(() => {
		const currentConversations = activeTab === "buyers" ? buyerConversations : sellerConversations;
		return currentConversations.filter(
			(conv: ConversationType) =>
				conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	});

	let totalUnread = $derived(() => {
		const currentConversations = activeTab === "buyers" ? buyerConversations : sellerConversations;
		return currentConversations.reduce(
			(sum: number, conv: ConversationType) => sum + conv.unread,
			0,
		);
	});

	let buyerUnread = $derived(
		buyerConversations.reduce((sum: number, conv: ConversationType) => sum + conv.unread, 0),
	);
	let sellerUnread = $derived(
		sellerConversations.reduce((sum: number, conv: ConversationType) => sum + conv.unread, 0),
	);
</script>

<div class="h-full {isMobile ? 'w-full' : 'flex w-85 flex-col'}">
	<Card class="flex h-full flex-col gap-3 overflow-hidden border-0 pt-0 shadow-sm">
		<CardHeader class="border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-sm">
			<div class="mb-0 flex items-center justify-between">
				<CardTitle class="text-lg font-semibold text-gray-900">Messages</CardTitle>
				{#if totalUnread() > 0}
					<Badge variant="destructive" class="px-1.5 py-0.5 text-xs font-medium">
						{totalUnread()} new
					</Badge>
				{/if}
			</div>

			<!-- Tab Controls -->
			<ToggleGroup
				type="single"
				value={activeTab}
				onValueChange={(value) => {
					if (value) activeTab = value as "buyers" | "sellers";
				}}
				class="grid w-full grid-cols-2 gap-0 rounded-lg border border-gray-200 bg-gray-50 p-0.5"
			>
				<ToggleGroupItem
					value="buyers"
					class="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=off]:text-gray-600 hover:data-[state=off]:text-gray-800 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm"
				>
					Buyers
					{#if buyerUnread > 0}
						<Badge
							variant="destructive"
							class="h-3.5 min-w-[0.875rem] px-1 py-0 text-[9px] font-medium"
						>
							{buyerUnread}
						</Badge>
					{/if}
				</ToggleGroupItem>
				<ToggleGroupItem
					value="sellers"
					class="flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=off]:text-gray-600 hover:data-[state=off]:text-gray-800 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm"
				>
					Sellers
					{#if sellerUnread > 0}
						<Badge
							variant="destructive"
							class="h-3.5 min-w-[0.875rem] px-1 py-0 text-[9px] font-medium"
						>
							{sellerUnread}
						</Badge>
					{/if}
				</ToggleGroupItem>
			</ToggleGroup>

			<div class="mt-3">
				<Input
					type="text"
					placeholder="Search {activeTab}..."
					bind:value={searchQuery}
					class="h-8 w-full border-gray-200 bg-white/50 text-sm backdrop-blur-sm focus:border-blue-300 focus:ring-blue-100"
				/>
			</div>
		</CardHeader>
		<CardContent class="flex-1 overflow-y-auto bg-gray-50/30 p-0">
			<div class="divide-y divide-gray-100">
				{#each filteredConversations() as conversation (conversation.id)}
					<button
						class="w-full cursor-pointer p-3 text-left transition-all duration-200 hover:bg-white/80 hover:shadow-sm {selectedConversation?.id ===
							conversation.id && !isMobile
							? 'border-r-3 border-blue-500 bg-white shadow-sm'
							: ''} group active:bg-gray-50"
						onclick={() => onSelectConversation(conversation)}
					>
						<div class="flex items-start gap-3">
							<div class="relative flex-shrink-0">
								<img
									src={conversation.avatar}
									alt={conversation.name}
									class="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white transition-transform group-hover:scale-105"
								/>
								{#if conversation.online}
									<div
										class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-sm"
									></div>
								{/if}
							</div>
							<div class="min-w-0 flex-1 space-y-0.5">
								<div class="flex items-center justify-between">
									<h3
										class="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
									>
										{conversation.name}
									</h3>
									<div class="flex items-center gap-1.5">
										{#if conversation.unread > 0}
											<Badge
												variant="destructive"
												class="h-4 min-w-[1rem] px-1.5 py-0 text-[10px] font-medium shadow-sm"
											>
												{conversation.unread}
											</Badge>
										{/if}
										<span class="text-[11px] font-medium whitespace-nowrap text-gray-500"
											>{conversation.timestamp}</span
										>
									</div>
								</div>
								<div class="flex items-center gap-1.5">
									<p
										class="truncate rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-600"
									>
										{conversation.properties.at(0)?.name}
									</p>
									<Badge
										variant="outline"
										class="h-4 border-gray-300 bg-white/80 px-1 text-[10px] text-gray-600"
									>
										{activeTab === "buyers" ? "Buyer" : "Seller"}
									</Badge>
								</div>
								<p class="truncate text-xs leading-relaxed text-gray-600">
									{conversation.lastMessage}
								</p>
							</div>
						</div>
					</button>
				{/each}

				{#if filteredConversations().length === 0}
					<div class="p-8 text-center text-gray-500">
						<div
							class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"
						>
							<svg
								class="h-6 w-6 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								></path>
							</svg>
						</div>
						<p class="mb-1 text-sm font-medium text-gray-700">
							No {activeTab} conversations found
						</p>
						{#if searchQuery}
							<p class="text-xs text-gray-500">Try adjusting your search terms</p>
						{:else}
							<p class="text-xs text-gray-500">Your {activeTab} conversations will appear here</p>
						{/if}
					</div>
				{/if}
			</div>
		</CardContent>
	</Card>
</div>

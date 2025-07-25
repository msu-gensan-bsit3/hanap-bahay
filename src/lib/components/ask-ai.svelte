<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { MessageCircle, Send, X } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	let open = $state(false);
	let msg = $state("");

	function toggleChat() {
		open = !open;
	}

	const askAi = moreEnhance({
		reset: false,
		onSubmitted: (res) => {
			if (res?.msg) {
				conversations.push({ type: "AI", msg: res.msg as string });
			}
		},
		onSubmit: () => {
			conversations.push({ type: "You", msg });
			msg = "";
		},
	});
	const { enhance, submitting } = $derived(askAi);

	const conversations: { type: "AI" | "You"; msg: string }[] = $state([
		{
			type: "AI",
			msg: "Hello! How can I help you find your new home? I can assist with property searches, neighborhood information, pricing, and more!",
		},
	]);

	const closeEvent = (e: KeyboardEvent) => {
		if (e.code === "Escape") {
			open = false;
		}
	};
	onMount(() => {
		document.addEventListener("keydown", closeEvent);
		return () => {
			document.removeEventListener("keydown", closeEvent);
		};
	});
</script>

<div class="fixed right-4 bottom-4 z-50" onblur={() => (open = false)}>
	{#if !open}
		<div in:fade={{ delay: 200, duration: 100 }}>
			<Button onclick={toggleChat} class="h-16 w-16 cursor-pointer rounded-full">
				<MessageCircle />
				<span class="sr-only">Ask AI</span>
			</Button>
		</div>
	{/if}

	{#if open}
		<div transition:fly={{ y: 20, duration: 200 }}>
			<Card.Root class="w-96">
				<Card.Header class="flex flex-row items-center justify-between">
					<Card.Title>Ask AI</Card.Title>
					<Button variant="ghost" size="icon" onclick={toggleChat}>
						<X class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content>
					<div class="h-80 space-y-4 overflow-y-auto p-2">
						{#each conversations as conversation}
							{#if conversation.type === "AI"}
								<div class="flex items-start gap-2.5">
									<div class="flex w-full max-w-[320px] flex-col gap-1">
										<div class="flex items-center space-x-2 rtl:space-x-reverse">
											<span class="text-sm font-semibold text-gray-900 dark:text-white">AI</span>
										</div>
										<div
											class="flex flex-col rounded-e-xl rounded-es-xl border-gray-200 bg-gray-100 p-4 leading-1.5 dark:bg-gray-700"
										>
											<p class="text-sm font-normal text-gray-900 dark:text-white">
												{conversation.msg}
											</p>
										</div>
									</div>
								</div>
							{:else}
								<div class="flex items-start justify-end gap-2.5">
									<div class="flex max-w-[320px] flex-col gap-1">
										<div class="flex items-center justify-end space-x-2 rtl:space-x-reverse">
											<span class="text-sm font-semibold text-gray-900 dark:text-white">You</span>
										</div>
										<div
											class="flex flex-col rounded-s-xl rounded-ee-xl bg-blue-600 p-4 leading-1.5"
										>
											<p class="text-sm font-normal text-white">
												{conversation.msg}
											</p>
										</div>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</Card.Content>
				<Card.Footer>
					<form class="relative w-full" action="?/askAi" use:enhance method="POST">
						<Input
							placeholder="Type your message..."
							class="pr-12"
							name="chatInput"
							required
							bind:value={msg}
						/>
						<input type="hidden" name="sessionId" value={crypto.randomUUID()} />
						<Button
							size="icon"
							type="submit"
							class="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 cursor-pointer"
							disabled={submitting}
						>
							<Send class="h-4 w-4" />
							<span class="sr-only">Send message</span>
						</Button>
					</form>
				</Card.Footer>
			</Card.Root>
		</div>
	{/if}
</div>

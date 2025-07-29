<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { Bot, Send, X } from "@lucide/svelte";
	import { marked } from "marked";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	let open = $state(false);
	let msg = $state("");
	let container: HTMLElement | undefined = $state();
	let chatContainer: HTMLElement | undefined = $state();

	function toggleChat() {
		open = !open;
	}

	// Configure marked for safe HTML rendering
	marked.setOptions({
		breaks: true,
		gfm: true,
	});

	function parseMarkdown(text: string): string {
		return marked.parse(text) as string;
	}

	const askAi = moreEnhance({
		reset: false,
		onSubmitted: (res) => {
			if (res?.msg) {
				conversations.push({ type: "JuanBot", msg: res.msg as string });
			}
		},
		onSubmit: () => {
			conversations.push({ type: "You", msg });
			msg = "";
			setTimeout(() => {
				container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
			}, 100);
		},
	});
	const { enhance, submitting } = $derived(askAi);

	const conversations: { type: "JuanBot" | "You"; msg: string }[] = $state([
		{
			type: "JuanBot",
			msg: "Hello! How can I assist you?",
		},
	]);

	const closeEvent = (e: KeyboardEvent) => {
		if (e.code === "Escape") {
			open = false;
		}
	};

	const handleOutsideClick = (e: MouseEvent) => {
		if (chatContainer && !chatContainer.contains(e.target as Node) && open) {
			open = false;
		}
	};

	onMount(() => {
		document.addEventListener("keydown", closeEvent);
		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("keydown", closeEvent);
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	});
</script>

<div class="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
	{#if !open}
		<div in:fade={{ delay: 200, duration: 100 }}>
			<Button
				onclick={toggleChat}
				class="group relative h-14 w-14 cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl sm:h-16 sm:w-16"
			>
				<!-- Pulse animation background -->
				<div
					class="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75"
				></div>

				<!-- Main icon -->
				<div class="relative flex items-center justify-center">
					<Bot
						class="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7"
					/>
				</div>

				<!-- Notification badge -->
				<div
					class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
				>
					<span class="animate-pulse">AI</span>
				</div>

				<span class="sr-only">Ask JuanBot</span>
			</Button>

			<!-- Tooltip -->
			<div class="absolute right-0 bottom-full mb-2 hidden sm:block">
				<div
					class="rounded-lg bg-gray-900 px-3 py-2 text-sm whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
				>
					Ask JuanBot for help
					<div
						class="absolute top-full right-4 border-4 border-transparent border-t-gray-900"
					></div>
				</div>
			</div>
		</div>
	{/if}

	{#if open}
		<div transition:fly={{ y: 20, duration: 200 }} bind:this={chatContainer}>
			<Card.Root
				class="flex max-h-[80vh] w-80 flex-col border-0 bg-white pt-0 shadow-2xl sm:w-96 dark:bg-gray-900"
			>
				<Card.Header
					class="flex flex-row items-center justify-between rounded-t-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3 dark:from-gray-800 dark:to-gray-800"
				>
					<div class="flex items-center gap-2">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
						>
							<Bot class="h-4 w-4 text-white" />
						</div>
						<Card.Title class="text-gray-900 dark:text-white">JuanBot Assistant</Card.Title>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onclick={toggleChat}
						class="hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<X class="h-4 w-4" />
					</Button>
				</Card.Header>
				<Card.Content class="flex-1 overflow-hidden p-0">
					<div class="h-80 space-y-4 overflow-y-auto p-4 sm:h-96" bind:this={container}>
						{#each conversations as conversation, i (i)}
							{#if conversation.type === "JuanBot"}
								<div class="flex items-start gap-2.5">
									<div
										class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
									>
										<Bot class="h-3 w-3 text-white" />
									</div>
									<div class="flex max-w-[85%] flex-col gap-1">
										<div class="flex items-center space-x-2 rtl:space-x-reverse">
											<span class="text-xs font-semibold text-gray-700 dark:text-gray-300">
												JuanBot
											</span>
										</div>
										<div
											class="flex flex-col rounded-r-xl rounded-bl-xl border border-gray-200 bg-gray-50 p-3 leading-1.5 dark:border-gray-600 dark:bg-gray-700"
										>
											<div
												class="markdown-content text-sm font-normal text-gray-900 dark:text-white"
											>
												{@html parseMarkdown(conversation.msg)}
											</div>
										</div>
									</div>
								</div>
							{:else}
								<div class="flex items-start justify-end gap-2.5">
									<div class="flex max-w-[85%] flex-col gap-1">
										<div class="flex items-center justify-end space-x-2 rtl:space-x-reverse">
											<span class="text-xs font-semibold text-gray-700 dark:text-gray-300">You</span
											>
										</div>
										<div
											class="flex flex-col rounded-l-xl rounded-br-xl bg-gradient-to-r from-blue-600 to-purple-600 p-3 leading-1.5"
										>
											<p class="text-sm font-normal text-white">
												{conversation.msg}
											</p>
										</div>
									</div>
									<div
										class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600"
									>
										<span class="text-xs font-medium text-gray-700 dark:text-gray-300">U</span>
									</div>
								</div>
							{/if}
						{/each}

						<!-- JuanBot Thinking Animation -->
						{#if submitting}
							<div class="flex items-start gap-2.5" transition:fade={{ duration: 200 }}>
								<div
									class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
								>
									<Bot class="h-3 w-3 text-white" />
								</div>
								<div class="flex max-w-[85%] flex-col gap-1">
									<div class="flex items-center space-x-2 rtl:space-x-reverse">
										<span class="text-xs font-semibold text-gray-700 dark:text-gray-300"
											>JuanBot</span
										>
									</div>
									<div
										class="flex flex-col rounded-r-xl rounded-bl-xl border border-gray-200 bg-gray-50 p-3 leading-1.5 dark:border-gray-600 dark:bg-gray-700"
									>
										<p
											class="flex items-center gap-2 text-sm font-normal text-gray-900 dark:text-white"
										>
											Thinking
											<span class="flex space-x-1">
												<span
													class="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"
													style="animation-delay: 0s;"
												></span>
												<span
													class="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-600"
													style="animation-delay: 0.2s;"
												></span>
												<span
													class="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"
													style="animation-delay: 0.4s;"
												></span>
											</span>
										</p>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</Card.Content>
				<Card.Footer class="rounded-b-lg border-t bg-gray-50 dark:bg-gray-800">
					<form class="relative w-full" action="?/askAi" use:enhance method="POST">
						<Input
							placeholder="Type your message..."
							class="border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
							name="chatInput"
							required
							bind:value={msg}
						/>
						<input type="hidden" name="sessionId" value={crypto.randomUUID()} />
						<Button
							size="icon"
							type="submit"
							class="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

<style>
	.markdown-content :global(h1),
	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4),
	.markdown-content :global(h5),
	.markdown-content :global(h6) {
		font-weight: 600;
		margin-top: 0.5rem;
		margin-bottom: 0.25rem;
		line-height: 1.25;
	}

	.markdown-content :global(h1) {
		font-size: 1.125rem;
	}
	.markdown-content :global(h2) {
		font-size: 1rem;
	}
	.markdown-content :global(h3) {
		font-size: 0.875rem;
	}

	.markdown-content :global(p) {
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin-left: 1rem;
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(li) {
		margin-bottom: 0.25rem;
	}

	.markdown-content :global(strong) {
		font-weight: 600;
	}

	.markdown-content :global(em) {
		font-style: italic;
	}

	.markdown-content :global(code) {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family:
			ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Noto Sans Mono",
			"Droid Sans Mono", "Liberation Mono", Consolas, "Courier New", monospace;
		font-size: 0.8em;
	}

	.markdown-content :global(pre) {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 0.75rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(pre code) {
		background-color: transparent;
		padding: 0;
	}

	.markdown-content :global(blockquote) {
		border-left: 3px solid #e5e7eb;
		padding-left: 0.75rem;
		margin-left: 0;
		margin-bottom: 0.5rem;
		font-style: italic;
	}

	.markdown-content :global(a) {
		color: #3b82f6;
		text-decoration: underline;
	}
</style>

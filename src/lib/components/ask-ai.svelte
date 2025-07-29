<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import { MessageCircle, Send, X } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { marked } from "marked";

	let open = $state(false);
	let msg = $state("");
	let container: HTMLElement | undefined = $state();

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
				<span class="sr-only">Ask JuanBot</span>
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
					<div class="h-100 space-y-4 overflow-y-auto p-2" bind:this={container}>
						{#each conversations as conversation, i (i)}
							{#if conversation.type === "JuanBot"}
								<div class="flex items-start gap-2.5">
									<div class="flex max-w-[320px] flex-col gap-1">
										<div class="flex items-center space-x-2 rtl:space-x-reverse">
											<span class="text-sm font-semibold text-gray-900 dark:text-white">
												JuanBot
											</span>
										</div>
										<div
											class="flex flex-col rounded-e-xl rounded-es-xl border-gray-200 bg-gray-100 p-4 leading-1.5 dark:bg-gray-700"
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

						<!-- JuanBot Thinking Animation -->
						{#if submitting}
							<div class="flex items-start gap-2.5" transition:fade={{ duration: 200 }}>
								<div class="flex max-w-[320px] flex-col gap-1">
									<div class="flex items-center space-x-2 rtl:space-x-reverse">
										<span class="text-sm font-semibold text-gray-900 dark:text-white">JuanBot</span>
									</div>
									<div
										class="flex flex-col rounded-e-xl rounded-es-xl border-gray-200 bg-gray-100 p-4 leading-1.5 dark:bg-gray-700"
									>
										<p
											class="flex items-center gap-2 text-sm font-normal text-gray-900 dark:text-white"
										>
											Thinking
											<span class="flex space-x-1">
												<span class="h-1 w-1 animate-pulse rounded-full bg-gray-600"></span>
												<span
													class="h-1 w-1 animate-pulse rounded-full bg-gray-600"
													style="animation-delay: 0.2s;"
												></span>
												<span
													class="h-1 w-1 animate-pulse rounded-full bg-gray-600"
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

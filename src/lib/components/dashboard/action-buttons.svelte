<script lang="ts">
	import { goto } from "$app/navigation";
	import type { ButtonVariant } from "$lib/components/ui/button";
	import { Button } from "$lib/components/ui/button";
	import { ClipboardCheck, MessageSquare, type IconProps } from "@lucide/svelte";
	import type { Component } from "svelte";

	interface ActionButton {
		label: string;
		icon: Component<IconProps>;
		variant: ButtonVariant;
		class?: string;
		onclick?: () => void;
	}

	const actionButtons: ActionButton[] = [
		{
			label: "View Messages",
			icon: MessageSquare,
			variant: "default",
			class: "bg-blue-600 hover:bg-blue-700",
			onclick: () => goto("/agent/messages"),
		},
		{
			label: "Review Submissions",
			icon: ClipboardCheck,
			variant: "outline",
			onclick: () => goto("/agent/listings"),
		},
	];
</script>

<div class="flex flex-wrap gap-4">
	{#each actionButtons as button}
		<Button variant={button.variant} class={button.class || ""} onclick={button.onclick}>
			<div class="flex items-center gap-2">
				<button.icon />
				<span>{button.label}</span>
			</div>
		</Button>
	{/each}
</div>

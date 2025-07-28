<script lang="ts">
	import type { ButtonVariant } from "$lib/components/ui/button";
	import { Button } from "$lib/components/ui/button";
	import { ClipboardCheck, MessageSquare, Plus, type IconProps } from "@lucide/svelte";
	import type { Component } from "svelte";

	interface ActionButton {
		label: string;
		icon: Component<IconProps>;
		variant: ButtonVariant;
		class?: string;
	}

	const actionButtons: ActionButton[] = [
		{
			label: "Create Listing",
			icon: Plus,
			variant: "default",
			class: "bg-blue-600 hover:bg-blue-700",
		},
		{
			label: "Review Submissions",
			icon: ClipboardCheck,
			variant: "outline",
		},
		{
			label: "View Messages",
			icon: MessageSquare,
			variant: "outline",
		},
	];
</script>

<div class="flex flex-wrap gap-4">
	{#each actionButtons as button}
		<Button variant={button.variant} class={button.class || ""}>
			<div class="flex items-center gap-2">
				<button.icon />
				<span>{button.label}</span>
			</div>
		</Button>
	{/each}
</div>

<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Check, X, Edit } from "@lucide/svelte";

	interface Props {
		onApprove?: () => void;
		onReject?: () => void;
		onRequestRevisions?: () => void;
	}

	let { onApprove, onReject, onRequestRevisions }: Props = $props();
</script>

<Card class="property-card">
	<CardHeader>
		<CardTitle>Review Actions</CardTitle>
	</CardHeader>
	<CardContent class="space-y-3">
		<Button class="w-full bg-green-600 text-white hover:bg-green-700" onclick={onApprove}>
			<Check class="mr-2 h-4 w-4" />
			Approve Listing
		</Button>

		<Button class="w-full bg-red-600 text-white hover:bg-red-700" onclick={onReject}>
			<X class="mr-2 h-4 w-4" />
			Reject Listing
		</Button>

		<Button
			class="w-full bg-yellow-600 text-white hover:bg-yellow-700"
			onclick={onRequestRevisions}
		>
			<Edit class="mr-2 h-4 w-4" />
			Request Revisions
		</Button>
	</CardContent>
</Card>

<style>
	/* Smooth transitions for cards */
	:global(.property-card) {
		transition: box-shadow 0.2s ease-in-out;
	}

	:global(.property-card:hover) {
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>

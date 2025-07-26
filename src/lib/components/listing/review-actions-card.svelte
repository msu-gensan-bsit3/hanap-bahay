<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Check, X, Edit } from "@lucide/svelte";

	export let onApprove: (() => void) | undefined = undefined;
	export let onReject: (() => void) | undefined = undefined;
	export let onRequestRevisions: (() => void) | undefined = undefined;
</script>

<Card class="property-card">
	<CardHeader>
		<CardTitle>Review Actions</CardTitle>
	</CardHeader>
	<CardContent class="space-y-3">
		<Button 
			class="w-full bg-green-600 hover:bg-green-700 text-white"
			onclick={onApprove}
		>
			<Check class="h-4 w-4 mr-2" />
			Approve Listing
		</Button>
		
		<Button 
			class="w-full bg-red-600 hover:bg-red-700 text-white"
			onclick={onReject}
		>
			<X class="h-4 w-4 mr-2" />
			Reject Listing
		</Button>
		
		<Button 
			class="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
			onclick={onRequestRevisions}
		>
			<Edit class="h-4 w-4 mr-2" />
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

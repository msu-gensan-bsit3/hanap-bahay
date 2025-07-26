<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";

	export let onSaveNote: ((note: string) => void) | undefined = undefined;
	
	let noteText = "";

	function handleSaveNote() {
		if (onSaveNote && noteText.trim()) {
			onSaveNote(noteText.trim());
			noteText = "";
		}
	}
</script>

<Card class="property-card">
	<CardHeader>
		<CardTitle>Add Note</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		<div>
			<Label for="note-textarea" class="sr-only">Add a private note about this listing</Label>
			<textarea
				id="note-textarea"
				bind:value={noteText}
				placeholder="Add a private note about this listing..."
				class="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			></textarea>
		</div>
		
		<Button 
			class="bg-blue-600 hover:bg-blue-700 text-white"
			onclick={handleSaveNote}
			disabled={!noteText.trim()}
		>
			Save Note
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

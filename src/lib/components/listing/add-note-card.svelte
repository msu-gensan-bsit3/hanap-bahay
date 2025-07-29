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
				class="min-h-[120px] w-full resize-none rounded-lg border border-gray-200 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
			></textarea>
		</div>

		<Button
			class="bg-blue-600 text-white hover:bg-blue-700"
			onclick={handleSaveNote}
			disabled={!noteText.trim()}
		>
			Save Note
		</Button>
	</CardContent>
</Card>

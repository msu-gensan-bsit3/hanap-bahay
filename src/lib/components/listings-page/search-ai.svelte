<script lang="ts">
	import { slide } from 'svelte/transition'

	import { Button } from "$lib/components/ui/button/index"
	import { Input } from "$lib/components/ui/input/index"

	import { SearchCode } from "@lucide/svelte"

	let hover = $state(false)
</script>

<div class="flex gap-2">
	<div class="relative overflow-hidden flex-shrink-0">
		<Input class="h-12 p-1 rounded-full"/>
		<div class="w-full absolute top-0 flex">
			<div class="w-full flex justify-between m-1.5">
				<div></div>
				<div class="w-fit" transition:slide>
					<Button
						onmouseenter={() => { hover = true }}
						onmouseleave={() => { hover = false }}
						size="lg"
						class="rounded-full"
					>
						<SearchCode class="size-5" />
						{#if hover}
							Search with AI
						{/if}
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
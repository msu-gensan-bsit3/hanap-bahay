<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";
	import { Award } from "@lucide/svelte";

	const credentials = [
		"All Credentials",
		"Licensed Real Estate Broker",
		"Senior Real Estate Broker",
		"Real Estate Sales Associate",
		"Real Estate Sales Specialist",
	] as const;

	let { credential = $bindable() }: { credential: string } = $props();
</script>

<Select.Root type="single" bind:value={credential}>
	<Select.Trigger class="h-10 w-full min-w-[120px] gap-2">
		<Award class="h-4 w-4 flex-shrink-0" />
		<span class="truncate">{credential}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each credentials as cred (cred)}
				<Select.Item value={cred}>
					{cred}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

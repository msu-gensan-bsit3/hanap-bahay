<script lang="ts">
	import * as Select from "$lib/components/ui/select/index";
	import { Clock } from "@lucide/svelte";

	const experienceRanges = [
		"Any Experience",
		"0-2 years",
		"3-5 years",
		"6-10 years",
		"10+ years",
	] as const;

	let { experience = $bindable() }: { experience: string } = $props();
</script>

<Select.Root type="single" bind:value={experience}>
	<Select.Trigger class="h-10 w-full min-w-[120px] gap-2">
		<Clock class="h-4 w-4 flex-shrink-0" />
		<span class="truncate">{experience}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each experienceRanges as exp (exp)}
				<Select.Item value={exp}>
					{exp}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

<script lang="ts">
	import * as Carousel from "$lib/components/ui/carousel/index"
	import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";

	import { Image } from "@lucide/svelte"

	let api = $state<CarouselAPI>()

	const count = $derived(api ? api.scrollSnapList().length : 0)
	let current = $state(0)

	let { photosUrl } = $props()

	$effect(() => {
		if (api) {
			current = api.selectedScrollSnap() + 1;
			api.on("select", () => {
				current = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<Carousel.Root
	setApi={(emblaApi) => (api = emblaApi)}
	class="w-full h-full relative overflow-hidden"
>
	<Carousel.Content class="w-full relative -ml-0">
		{#each photosUrl as photoUrl (photoUrl.url)}
			<Carousel.Item class="pl-0">
				<img
					src={photoUrl.url}
					alt="property photos"
					class="object-cover object-bottom h	-full"
				>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<div class="w-full h-full absolute inset-0 flex flex-col items-center justify-between p-1">
		<div></div>
		<div class="w-full flex items justify-between mx-2">
			<Carousel.Previous />
			<Carousel.Next />
		</div>
		<div class="bg-background rounded-sm inline-flex py-1 px-2 text-xs font-semibold gap-1">
			<Image class="size-4"/> {current}/{count}
		</div>
	</div>
</Carousel.Root>
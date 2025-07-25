<script lang="ts">
	import AskAi from "$lib/components/ask-ai.svelte";
	import ListingCard from "$lib/components/listing-card.svelte";

	import { Button } from "$lib/components/ui/button/index";
	import { Input } from "$lib/components/ui/input/index";
	import { Label } from "$lib/components/ui/label/index";

	import * as Carousel from "$lib/components/ui/carousel/index.js";

	import { ChevronLast, Search } from "@lucide/svelte";

	let { data } = $props();
	let { listings } = $derived(data);
</script>

<div
	class="mb-4 w-full bg-[url(https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iU07NrehBC9I/v0/-1x-1.webp)] bg-no-repeat"
>
	<div class="mx-auto max-h-screen max-w-xl">
		<div class="container mx-auto py-12">
			<div class="mx-auto max-w-4xl gap-4 text-center">
				<h1 class="mb-4 text-5xl leading-tight font-bold tracking-tight text-background">
					In
					<span class="bg-gradient-to-r from-amber-300 to-red-500 bg-clip-text text-transparent"
						>JuanHomes</span
					>
					you can find the
					<span class="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent"
						>one</span
					>
					which feels like
					<span class="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent"
						>home</span
					>
				</h1>
				<div class="mx-auto max-w-6xl">
					<div class="mx-auto rounded-2xl border bg-background">
						<div class="flex w-full items-center justify-between">
							<div class="flex flex-1 justify-start"></div>
							<div class="flex items-center justify-center">
								<div class="inline-flex">
									<!-- himo lang kog mga button variants unya -->
									<Button class="rounded-none border-b-1 border-red-700" variant="ghost"
										>For Rent</Button
									>
									<Button variant="ghost">For Sale</Button>
									<Button variant="ghost">For Lease</Button>
								</div>
							</div>
							<div class="flex flex-1 justify-end"></div>
						</div>
						<!-- i think iconvert man ni into a form, apparently wrapper sa superform ang form sa shadcn -->
						<div class="space-y-2 border-t p-4">
							<Label>What are you looking for?</Label>
							<div class="inline-flex w-full gap-2">
								<Input />
								<Button>
									<Search /> Search
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- convert lang nako ning carousel to component l8r-->
<div class="w-full bg-background">
	<Carousel.Root class="mx-auto max-w-screen-xl space-y-2 py-8">
		<div class="flex w-full items-center justify-between">
			<div>
				<h2 class="text-xl font-bold tracking-tight">Featured Listings</h2>
				<p class="text-sm text-muted-foreground">10+ new listings</p>
			</div>
			<div class="mx-3 inline-flex gap-6">
				<Carousel.Previous />
				<Carousel.Next />
			</div>
		</div>
		<Carousel.Content>
			<Carousel.Item class="basis-auto">
				<ListingCard {...listings[0]} />
			</Carousel.Item>
			<Carousel.Item class="flex basis-auto items-center justify-center">
				<a href="/" class="inline-flex rounded-lg border-2 px-10 py-4 text-muted-foreground">
					See More <ChevronLast strokeWidth={1} />
				</a>
			</Carousel.Item>
		</Carousel.Content>
	</Carousel.Root>
</div>

<div class="w-full bg-background">
	<Carousel.Root class="mx-auto max-w-screen-xl space-y-2 py-8">
		<div class="flex w-full items-center justify-between">
			<div>
				<h2 class="text-xl font-bold tracking-tight">Listings Nearby</h2>
				<p class="text-sm text-muted-foreground">10+ new listings</p>
			</div>
			<div class="mx-3 inline-flex gap-6">
				<Carousel.Previous />
				<Carousel.Next />
			</div>
		</div>
		<Carousel.Content>
			<Carousel.Item class="basis-auto">
				<ListingCard {...listings[0]} />
			</Carousel.Item>
		</Carousel.Content>
	</Carousel.Root>
</div>

<AskAi />

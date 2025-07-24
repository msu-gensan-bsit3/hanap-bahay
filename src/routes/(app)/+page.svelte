<script lang="ts">
	import { Button } from "$lib/components/ui/button/index"
	import { Input } from "$lib/components/ui/input/index"
	import { Label } from "$lib/components/ui/label/index"

	import * as Carousel from "$lib/components/ui/carousel/index.js";

	import { ChevronLeft, ChevronRight, Search } from "@lucide/svelte"
</script>

<div class="bg-[url(https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iU07NrehBC9I/v0/-1x-1.webp)] bg-no-repeat w-full">
	<div class="max-w-xl max-h-screen mx-auto">
		<div class="container mx-auto py-12">
			<div class="max-w-4xl mx-auto gap-4 text-center">
				<h1 class="mb-4 text-background text-5xl font-bold tracking-tight leading-tight">
					In
					<span class="bg-gradient-to-r from-amber-300 to-red-500 bg-clip-text text-transparent">JuanHomes</span>
					you can find the
					<span class="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">one</span>
					which feels like
					<span class="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">home</span>
				</h1>
				<div class="max-w-6xl mx-auto">
					<div class="bg-background rounded-2xl border mx-auto">
						<div class="w-full flex items-center justify-between">
							<div class="flex flex-1 justify-start"></div>
							<div class="flex items-center justify-center">
								<div class="inline-flex">
									<!-- himo lang kog mga button variants unya -->
									<Button class="border-b-1 border-red-700 rounded-none" variant="ghost">For Rent</Button>
									<Button variant="ghost">For Sale</Button>
									<Button variant="ghost">For Lease</Button>
								</div>
							</div>
							<div class="flex flex-1 justify-end"></div>
						</div>
						<!-- i think iconvert man ni into a form, apparently wrapper sa superform ang form sa shadcn -->
						<div class="p-4 border-t space-y-2">
							<Label>What are you looking for?</Label>
							<div class="w-full inline-flex gap-2">
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

<div class="bg-background w-full">
	<Carousel.Root class="max-w-screen-xl mx-auto py-8 space-y-2">
		<div class="w-full flex items-center justify-between">
			<div>
				<h2 class="text-xl font-bold tracking-tight">Featured Listings</h2>
				<p class="text-muted-foreground text-sm">10+ new listings</p>
			</div>
			<div class="inline-flex mx-3 gap-6">
				<Carousel.Previous />
				<Carousel.Next />
				<ChevronLeft size={42} class="border-1 rounded-full p-1 text-muted-foreground text-3xl" />
				<ChevronRight size={42} class="border-1 rounded-full p-1" />
			</div>
		</div>
		<Carousel.Content>
			<Carousel.Item>
				test
			</Carousel.Item>
		</Carousel.Content>
	</Carousel.Root>
</div>
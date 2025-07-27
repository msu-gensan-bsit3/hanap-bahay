<script lang="ts">
	import { heights } from "$lib/states/heights.svelte";
	import { Facebook, Instagram, Mail, Phone, Twitter } from "@lucide/svelte";
</script>

<footer class="border-t-2 bg-muted" bind:clientHeight={heights.footer}>
	<div class="container mx-auto max-w-screen-xl px-4 py-12">
		<div class="mb-12 grid grid-cols-4 gap-8">
			<div>
				<h3 class="font-semibold">Buy</h3>
				<ul class="space-y-2">
					<li>Homes</li>
					<li>Properties</li>
					<li>placeholder</li>
					<li>placeholder</li>
				</ul>
			</div>
			<div>
				<h3 class="font-semibold">Rent</h3>
				<ul class="space-y-2">
					<li>Homes</li>
					<li>Properties</li>
					<li>placeholder</li>
					<li>placeholder</li>
				</ul>
			</div>
			<div>
				<h3 class="font-semibold">Lease</h3>
				<ul class="space-y-2">
					<li>Homes</li>
					<li>Properties</li>
					<li>placeholder</li>
				</ul>
			</div>
			<div>
				<h3 class="font-semibold">Contact Us</h3>
				<ul class="space-y-2">
					<li class="flex items-center gap-2">
						<Phone class="size-4" /> (+63) 912 345 6789
					</li>
					<li class="flex items-center gap-2">
						<Mail class="size-4" /> juan@homes.ph
					</li>
				</ul>
			</div>
		</div>
		<div class="flex flex-row items-center justify-between border-t pt-8">
			<div class="flex flex-col">
				<div class="font-semibold">© 2025 JuanHomes. All rights reserved.</div>
				<div>
					Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur
					adipiscing elit quisque faucibus.
				</div>
			</div>
			<div class="flex space-x-6">
				<Facebook />
				<Instagram />
				<Twitter />
			</div>
		</div>
	</div>
</footer>

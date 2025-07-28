<script lang="ts">
	import { goto } from "$app/navigation";
	import { heights } from "$lib/states/heights.svelte";
	import { Facebook, Instagram, Mail, Phone, Twitter } from "@lucide/svelte";

	function navigateToListings(params: Record<string, string>) {
		const searchParams = new URLSearchParams(params);
		goto(`/listings?${searchParams.toString()}`);
	}
</script>

<footer class="border-t bg-muted/50 backdrop-blur-sm" bind:clientHeight={heights.footer}>
	<div class="container mx-auto max-w-screen-xl px-4 py-8 md:py-12">
		<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mb-12 md:gap-8 lg:grid-cols-4">
			<div class="space-y-3">
				<h3 class="mb-4 text-lg font-semibold text-foreground">Buy</h3>
				<ul class="space-y-3 text-sm text-muted-foreground">
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() =>
								navigateToListings({ saleType: "For Sale", category: "house-and-lot" })}
						>
							Single Family Homes
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({ saleType: "For Sale", category: "condominium" })}
						>
							Condominiums
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({ saleType: "For Sale", category: "townhouse" })}
						>
							Townhouses
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({ saleType: "For Sale", minPrice: "10000000" })}
						>
							Luxury Properties
						</button>
					</li>
				</ul>
			</div>
			<div class="space-y-3">
				<h3 class="mb-4 text-lg font-semibold text-foreground">Rent</h3>
				<ul class="space-y-3 text-sm text-muted-foreground">
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({ saleType: "For Rent", category: "apartment" })}
						>
							Apartments
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() =>
								navigateToListings({ saleType: "For Rent", category: "house-and-lot" })}
						>
							Houses
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() =>
								navigateToListings({
									saleType: "For Rent",
									category: "apartment",
									maxPrice: "20000",
								})}
						>
							Studio Units
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({ saleType: "For Rent", category: "office" })}
						>
							Commercial Spaces
						</button>
					</li>
				</ul>
			</div>
			<div class="space-y-3">
				<h3 class="mb-4 text-lg font-semibold text-foreground">Services</h3>
				<ul class="space-y-3 text-sm text-muted-foreground">
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({ saleType: "For Rent" })}
						>
							Property Management
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({})}
						>
							Real Estate Consultation
						</button>
					</li>
					<li>
						<button
							class="cursor-pointer text-left transition-colors hover:text-foreground"
							onclick={() => navigateToListings({})}
						>
							Market Analysis
						</button>
					</li>
				</ul>
			</div>
			<div class="space-y-3">
				<h3 class="mb-4 text-lg font-semibold text-foreground">Contact Us</h3>
				<ul class="space-y-3 text-sm">
					<li
						class="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
					>
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Phone class="size-4 text-primary" />
						</div>
						<span>(+63) 912 345 6789</span>
					</li>
					<li
						class="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
					>
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Mail class="size-4 text-primary" />
						</div>
						<span>juan@homes.ph</span>
					</li>
				</ul>
			</div>
		</div>
		<div
			class="flex flex-col items-start justify-between gap-6 border-t pt-6 md:pt-8 lg:flex-row lg:items-center"
		>
			<div class="flex max-w-md flex-col space-y-2">
				<div class="text-sm font-semibold text-foreground">
					© 2025 JuanHomes. All rights reserved.
				</div>
				<div class="text-xs leading-relaxed text-muted-foreground">
					Your trusted partner in finding the perfect home. Making real estate dreams come true
					across the Philippines.
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<div class="hidden text-xs text-muted-foreground sm:block">Follow us:</div>
				<div class="flex space-x-3">
					<button
						class="group rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary/20"
					>
						<Facebook
							class="size-4 text-muted-foreground transition-colors group-hover:text-primary"
						/>
					</button>
					<button
						class="group rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary/20"
					>
						<Instagram
							class="size-4 text-muted-foreground transition-colors group-hover:text-primary"
						/>
					</button>
					<button
						class="group rounded-full bg-primary/10 p-2 transition-colors hover:bg-primary/20"
					>
						<Twitter
							class="size-4 text-muted-foreground transition-colors group-hover:text-primary"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</footer>

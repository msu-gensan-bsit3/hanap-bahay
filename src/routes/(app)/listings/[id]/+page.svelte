<script lang="ts">
	import {
		AddressCard,
		AgentCard,
		DescriptionCard,
		FeaturesCard,
		Header,
		InfoCard,
		IntentToBuyCta,
		Specs,
		TagsCard,
	} from "$lib/components/listing";
	import PropertyImageGallery from "$lib/components/property-image-gallery.svelte";

	let { data } = $props();

	const { listing } = $derived(data);
	const property = $derived(listing.property);

	const location = $derived(
		property.location as { longitude: number; latitude: number } | undefined,
	);
	const address = $derived(property.address);
	const fullAddress = $derived(
		[address.street, address.barangay, address.city, address.province, "Philippines"]
			.filter(Boolean)
			.join(", "),
	);

	console.log(data.role);
</script>

<div class="container mx-auto max-w-5xl px-3 py-8" class:opacity-75={listing.status === "sold"}>
	{#if listing.status === "sold"}
		<div class="mb-6 rounded border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium">This property has been sold and is no longer available.</p>
				</div>
			</div>
		</div>
	{/if}
	<Header
		propertyName={property.name}
		price={property.price}
		listingType={property.type}
		category={property.category}
		status={listing.status}
	/>

	<Specs
		bedrooms={property.bedrooms || undefined}
		bathrooms={property.bathrooms || undefined}
		floorArea={property.floorArea || undefined}
		carSpace={property.carSpace || undefined}
		landArea={property.landArea}
	/>

	<!-- Prominent Intent to Buy CTA -->
	<IntentToBuyCta
		agent={listing.agent}
		role={data.role}
		listingId={listing.id}
		listingStatus={listing.status}
	/>

	<div class="grid grid-cols-1 gap-8">
		<!-- Image Gallery -->
		<PropertyImageGallery photos={property.photosUrl || []} propertyName={property.name} />
		<AgentCard
			agent={listing.agent}
			role={data.role}
			listingId={listing.id}
			listingStatus={listing.status}
		/>

		<!-- Property Details -->
		<div class="space-y-6">
			<AddressCard {fullAddress} propertyName={property.name} {location} />
			<DescriptionCard description={property.description || undefined} />
			<FeaturesCard features={property.features} />
			<TagsCard tags={property.tags} />
			<InfoCard
				type={property.type}
				category={property.category}
				landArea={property.landArea}
				floorArea={property.floorArea}
			/>
		</div>
	</div>
</div>

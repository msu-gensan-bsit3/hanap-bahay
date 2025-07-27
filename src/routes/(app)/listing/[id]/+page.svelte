<script lang="ts">
	import PropertyImageGallery from "$lib/components/property-image-gallery.svelte";
	import { ArrowLeft } from "@lucide/svelte";
	import {
		Header,
		Specs,
		AddressCard,
		DescriptionCard,
		FeaturesCard,
		TagsCard,
		InfoCard,
		AgentCard,
	} from "$lib/components/listing";

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
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<!-- Back Button -->
	<div class="mb-6">
		<a
			href="/"
			class="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
		>
			<ArrowLeft class="size-4" />
			Back
		</a>
	</div>

	<Header
		propertyName={property.name}
		price={property.price}
		listingType={property.type}
		category={property.category}
	/>

	<Specs
		bedrooms={property.bedrooms || undefined}
		bathrooms={property.bathrooms || undefined}
		floorArea={property.floorArea || undefined}
		carSpace={property.carSpace || undefined}
		landArea={property.landArea}
	/>

	<div class="grid grid-cols-1 gap-8">
		<!-- Image Gallery -->
		<PropertyImageGallery photos={property.photosUrl || []} propertyName={property.name} />

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
			<AgentCard agent={listing.agent} role={data.role} listingId={listing.id} />
		</div>
	</div>
</div>

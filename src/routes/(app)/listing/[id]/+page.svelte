<script lang="ts">
	import PropertyImageGallery from "$lib/components/property-image-gallery.svelte";
	import Header from "$lib/components/listing/header.svelte";
	import Specs from "$lib/components/listing/specs.svelte";
	import AddressCard from "$lib/components/listing/address-card.svelte";
	import DescriptionCard from "$lib/components/listing/description-card.svelte";
	import FeaturesCard from "$lib/components/listing/features-card.svelte";
	import TagsCard from "$lib/components/listing/tags-card.svelte";
	import InfoCard from "$lib/components/listing/info-card.svelte";
	import AgentCard from "$lib/components/listing/agent-card.svelte";

	let { data } = $props();
	const { listing } = data;
	const property = listing.property;

	const location = property.location as { longitude: number; latitude: number } | undefined;

	const address = property.address;
	const fullAddress = [
		address.street,
		address.barangay,
		address.city,
		address.province,
		"Philippines",
	]
		.filter(Boolean)
		.join(", ");

	property.photosUrl = [
		property.photosUrl[0],
		{ url: "/no-image.jpg" },
		property.photosUrl[0],
		property.photosUrl[0],
		{ url: "/no-image.jpg" },
		{ url: "/no-image.jpg" },
		property.photosUrl[0],
		property.photosUrl[0],
	];
</script>

<div class="container mx-auto max-w-5xl px-4 py-8">
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
			<AgentCard agent={listing.agent} />
		</div>
	</div>
</div>

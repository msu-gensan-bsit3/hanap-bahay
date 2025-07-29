<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import type L from "leaflet";
	import "leaflet/dist/leaflet.css";
	import { onDestroy, onMount } from "svelte";

	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select";
	import { Textarea } from "$lib/components/ui/textarea";
	import { ArrowLeft, Home, MapPin, Save } from "@lucide/svelte";

	let { data, form } = $props();

	// Extract existing data from the listing
	const existingListing = data.listing;
	const existingProperty = existingListing.property;
	const existingAddress = existingProperty.address;

	let loading = $state(false);
	let formData = $state({
		// Property details
		name: form?.data?.name || existingProperty.name,
		description: form?.data?.description || existingProperty.description || "",
		type: form?.data?.type || existingProperty.type,
		category: form?.data?.category || existingProperty.category,
		price: form?.data?.price || existingProperty.price.toString(),
		landArea: form?.data?.landArea || existingProperty.landArea.toString(),
		floorArea: form?.data?.floorArea || existingProperty.floorArea?.toString() || "",
		bedrooms: form?.data?.bedrooms || existingProperty.bedrooms?.toString() || "",
		bathrooms: form?.data?.bathrooms || existingProperty.bathrooms?.toString() || "",
		carSpace: form?.data?.carSpace || existingProperty.carSpace?.toString() || "",
		// Address details
		street: form?.data?.street || existingAddress.street,
		barangay: form?.data?.barangay || existingAddress.barangay,
		city: form?.data?.city || existingAddress.city,
		province: form?.data?.province || existingAddress.province,
		// Location coordinates
		latitude:
			form?.data?.latitude ||
			(existingProperty.location &&
			typeof existingProperty.location === "object" &&
			"latitude" in existingProperty.location
				? existingProperty.location.latitude?.toString()
				: "") ||
			"",
		longitude:
			form?.data?.longitude ||
			(existingProperty.location &&
			typeof existingProperty.location === "object" &&
			"longitude" in existingProperty.location
				? existingProperty.location.longitude?.toString()
				: "") ||
			"",
		// Features and tags (as comma-separated strings for the UI)
		features: form?.data?.features || existingProperty.features.map((f) => f.name).join(", "),
		tags: form?.data?.tags || existingProperty.tags.map((t) => t.name).join(", "),
	});

	const propertyTypes = [
		{ value: "rent", label: "For Rent" },
		{ value: "sale", label: "For Sale" },
		{ value: "lease", label: "For Lease" },
	];

	const propertyCategories = [
		{ value: "house-and-lot", label: "House and Lot" },
		{ value: "apartment", label: "Apartment" },
		{ value: "boarding-house", label: "Boarding House" },
		{ value: "townhouse", label: "Townhouse" },
		{ value: "condominium", label: "Condominium" },
		{ value: "building", label: "Building" },
		{ value: "office", label: "Office" },
		{ value: "commercial-lot", label: "Commercial Lot" },
		{ value: "residential-lot", label: "Residential Lot" },
		{ value: "industrial-lot", label: "Industrial Lot" },
	];

	const philippineProvinces = [
		{ value: "Abra", label: "Abra" },
		{ value: "Agusan del Norte", label: "Agusan del Norte" },
		{ value: "Agusan del Sur", label: "Agusan del Sur" },
		{ value: "Aklan", label: "Aklan" },
		{ value: "Albay", label: "Albay" },
		{ value: "Antique", label: "Antique" },
		{ value: "Apayao", label: "Apayao" },
		{ value: "Aurora", label: "Aurora" },
		{ value: "Basilan", label: "Basilan" },
		{ value: "Bataan", label: "Bataan" },
		{ value: "Batanes", label: "Batanes" },
		{ value: "Batangas", label: "Batangas" },
		{ value: "Benguet", label: "Benguet" },
		{ value: "Biliran", label: "Biliran" },
		{ value: "Bohol", label: "Bohol" },
		{ value: "Bukidnon", label: "Bukidnon" },
		{ value: "Bulacan", label: "Bulacan" },
		{ value: "Cagayan", label: "Cagayan" },
		{ value: "Camarines Norte", label: "Camarines Norte" },
		{ value: "Camarines Sur", label: "Camarines Sur" },
		{ value: "Camiguin", label: "Camiguin" },
		{ value: "Capiz", label: "Capiz" },
		{ value: "Catanduanes", label: "Catanduanes" },
		{ value: "Cavite", label: "Cavite" },
		{ value: "Cebu", label: "Cebu" },
		{ value: "Cotabato", label: "Cotabato" },
		{ value: "Davao de Oro", label: "Davao de Oro" },
		{ value: "Davao del Norte", label: "Davao del Norte" },
		{ value: "Davao del Sur", label: "Davao del Sur" },
		{ value: "Davao Occidental", label: "Davao Occidental" },
		{ value: "Davao Oriental", label: "Davao Oriental" },
		{ value: "Dinagat Islands", label: "Dinagat Islands" },
		{ value: "Eastern Samar", label: "Eastern Samar" },
		{ value: "Guimaras", label: "Guimaras" },
		{ value: "Ifugao", label: "Ifugao" },
		{ value: "Ilocos Norte", label: "Ilocos Norte" },
		{ value: "Ilocos Sur", label: "Ilocos Sur" },
		{ value: "Iloilo", label: "Iloilo" },
		{ value: "Isabela", label: "Isabela" },
		{ value: "Kalinga", label: "Kalinga" },
		{ value: "La Union", label: "La Union" },
		{ value: "Laguna", label: "Laguna" },
		{ value: "Lanao del Norte", label: "Lanao del Norte" },
		{ value: "Lanao del Sur", label: "Lanao del Sur" },
		{ value: "Leyte", label: "Leyte" },
		{ value: "Maguindanao", label: "Maguindanao" },
		{ value: "Marinduque", label: "Marinduque" },
		{ value: "Masbate", label: "Masbate" },
		{ value: "Metro Manila", label: "Metro Manila" },
		{ value: "Misamis Occidental", label: "Misamis Occidental" },
		{ value: "Misamis Oriental", label: "Misamis Oriental" },
		{ value: "Mountain Province", label: "Mountain Province" },
		{ value: "Negros Occidental", label: "Negros Occidental" },
		{ value: "Negros Oriental", label: "Negros Oriental" },
		{ value: "Northern Samar", label: "Northern Samar" },
		{ value: "Nueva Ecija", label: "Nueva Ecija" },
		{ value: "Nueva Vizcaya", label: "Nueva Vizcaya" },
		{ value: "Occidental Mindoro", label: "Occidental Mindoro" },
		{ value: "Oriental Mindoro", label: "Oriental Mindoro" },
		{ value: "Palawan", label: "Palawan" },
		{ value: "Pampanga", label: "Pampanga" },
		{ value: "Pangasinan", label: "Pangasinan" },
		{ value: "Quezon", label: "Quezon" },
		{ value: "Quirino", label: "Quirino" },
		{ value: "Rizal", label: "Rizal" },
		{ value: "Romblon", label: "Romblon" },
		{ value: "Samar", label: "Samar" },
		{ value: "Sarangani", label: "Sarangani" },
		{ value: "Siquijor", label: "Siquijor" },
		{ value: "Sorsogon", label: "Sorsogon" },
		{ value: "South Cotabato", label: "South Cotabato" },
		{ value: "Southern Leyte", label: "Southern Leyte" },
		{ value: "Sultan Kudarat", label: "Sultan Kudarat" },
		{ value: "Sulu", label: "Sulu" },
		{ value: "Surigao del Norte", label: "Surigao del Norte" },
		{ value: "Surigao del Sur", label: "Surigao del Sur" },
		{ value: "Tarlac", label: "Tarlac" },
		{ value: "Tawi-Tawi", label: "Tawi-Tawi" },
		{ value: "Zambales", label: "Zambales" },
		{ value: "Zamboanga del Norte", label: "Zamboanga del Norte" },
		{ value: "Zamboanga del Sur", label: "Zamboanga del Sur" },
		{ value: "Zamboanga Sibugay", label: "Zamboanga Sibugay" },
	];

	// Map state
	let mapContainer: HTMLDivElement;
	let map: L.Map | undefined;
	let marker: L.Marker | undefined;
	let searchQuery = $state("");
	let searchLoading = $state(false);

	// Generate search query from address fields
	$effect(() => {
		const addressParts = [formData.street, formData.barangay, formData.city].filter(Boolean);

		if (addressParts.length > 0) {
			searchQuery = addressParts.join(", ");
		}
	});

	// Initialize map when container is ready
	async function initializeMap() {
		if (mapContainer && !map) {
			try {
				const L = await import("leaflet");

				// Fix for default markers in Leaflet
				delete (L.Icon.Default.prototype as any)._getIconUrl;
				L.Icon.Default.mergeOptions({
					iconRetinaUrl:
						"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
					iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
					shadowUrl:
						"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
				});

				// Use existing coordinates or default to Philippines center
				const defaultLat = formData.latitude ? parseFloat(formData.latitude) : 14.5995;
				const defaultLng = formData.longitude ? parseFloat(formData.longitude) : 120.9842;

				// Initialize Leaflet map
				map = L.map(mapContainer).setView([defaultLat, defaultLng], 13);

				// Add OpenStreetMap tiles
				L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
					attribution: "© OpenStreetMap contributors",
					maxZoom: 19,
				}).addTo(map);

				// Add marker with custom options
				marker = L.marker([defaultLat, defaultLng], {
					draggable: true,
					title: "Property Location (drag to move)",
				}).addTo(map);

				// Add popup to marker
				marker.bindPopup("Property Location<br>Drag to change position").openPopup();

				// Update coordinates when marker is dragged
				marker.on("dragend", function () {
					if (marker) {
						const position = marker.getLatLng();
						formData.latitude = position.lat.toFixed(6);
						formData.longitude = position.lng.toFixed(6);
						marker
							.getPopup()
							?.setContent(
								`Property Location<br>Lat: ${position.lat.toFixed(6)}<br>Lng: ${position.lng.toFixed(6)}`,
							);
					}
				});

				// Update marker position when map is clicked
				map.on("click", function (e: L.LeafletMouseEvent) {
					if (marker) {
						const { lat, lng } = e.latlng;
						marker.setLatLng([lat, lng]);
						formData.latitude = lat.toFixed(6);
						formData.longitude = lng.toFixed(6);
						marker
							.getPopup()
							?.setContent(`Property Location<br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`);
					}
				});

				// Handle map resize
				setTimeout(() => {
					if (map) {
						map.invalidateSize();
					}
				}, 100);
			} catch (error) {
				console.error("Failed to initialize map:", error);
			}
		}
	}

	// Search for location using Nominatim API
	async function searchLocation() {
		if (!searchQuery.trim()) return;

		searchLoading = true;
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=ph&limit=1`,
			);
			const results = await response.json();

			if (results.length > 0) {
				const { lat, lon, display_name } = results[0];
				const latitude = parseFloat(lat);
				const longitude = parseFloat(lon);

				// Update coordinates
				formData.latitude = latitude.toFixed(6);
				formData.longitude = longitude.toFixed(6);

				// Update map if initialized
				if (map && marker) {
					map.setView([latitude, longitude], 15);
					marker.setLatLng([latitude, longitude]);
					marker
						.getPopup()
						?.setContent(
							`Found: ${display_name}<br>Lat: ${latitude.toFixed(6)}<br>Lng: ${longitude.toFixed(6)}`,
						);
				}
			} else {
				alert(
					"Location not found. Please try a different search query or manually set the coordinates.",
				);
			}
		} catch (error) {
			console.error("Search error:", error);
			alert("Failed to search location. Please try again.");
		} finally {
			searchLoading = false;
		}
	}

	// Initialize the map when component mounts
	onMount(async () => {
		await initializeMap();
	});

	// Cleanup map when component is destroyed
	onDestroy(() => {
		if (map) {
			map.remove();
			map = undefined;
			marker = undefined;
		}
	});

	// Update map location based on coordinates
	function updateMapFromCoordinates() {
		const lat = parseFloat(formData.latitude);
		const lng = parseFloat(formData.longitude);

		if (!isNaN(lat) && !isNaN(lng) && map && marker) {
			map.setView([lat, lng], 13);
			marker.setLatLng([lat, lng]);
			marker
				.getPopup()
				?.setContent(`Property Location<br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`);
		}
	}

	// Format price for display
	function formatPrice(price: number): string {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			minimumFractionDigits: 0,
		}).format(price);
	}
</script>

<svelte:head>
	<title>Edit Listing - {existingProperty.name} - JuanHome</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-8">
		<div class="mb-4 flex items-center gap-4">
			<Button variant="outline" size="icon" onclick={() => goto("/agent/listings")}>
				<ArrowLeft class="h-4 w-4" />
			</Button>
			<div>
				<h1 class="text-2xl font-bold">Edit Listing</h1>
				<p class="text-muted-foreground">Update property information and details</p>
			</div>
		</div>

		<!-- Listing Status Badge -->
		<div class="flex items-center gap-2">
			<Badge
				variant={existingListing.status === "up"
					? "default"
					: existingListing.status === "pending"
						? "secondary"
						: existingListing.status === "sold"
							? "destructive"
							: "outline"}
			>
				{existingListing.status === "up"
					? "Active"
					: existingListing.status === "pending"
						? "Pending"
						: existingListing.status === "sold"
							? "Sold"
							: existingListing.status === "under-review"
								? "Under Review"
								: existingListing.status === "submitted"
									? "Submitted"
									: existingListing.status}
			</Badge>
			<span class="text-sm text-muted-foreground">
				Current price: {formatPrice(existingProperty.price)}
			</span>
		</div>
	</div>

	<form
		method="POST"
		action="?/update-listing"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		class="space-y-8"
	>
		<!-- Property Information -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Home class="h-5 w-5" />
					Property Information
				</CardTitle>
				<CardDescription>Update the basic information about the property</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Property Name -->
				<div class="space-y-2">
					<Label for="name">Property Name *</Label>
					<Input
						id="name"
						name="name"
						type="text"
						bind:value={formData.name}
						placeholder="Enter property name"
						required
					/>
					{#if form?.errors?.name}
						<p class="text-sm text-destructive">{form.errors.name[0]}</p>
					{/if}
				</div>

				<!-- Property Type and Category -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="type">Property Type *</Label>
						<Select.Root type="single" name="type" bind:value={formData.type} required>
							<Select.Trigger>
								<span
									>{propertyTypes.find((t) => t.value === formData.type)?.label ||
										"Select type"}</span
								>
							</Select.Trigger>
							<Select.Content>
								{#each propertyTypes as type}
									<Select.Item value={type.value}>{type.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if form?.errors?.type}
							<p class="text-sm text-destructive">{form.errors.type[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="category">Property Category *</Label>
						<Select.Root type="single" name="category" bind:value={formData.category} required>
							<Select.Trigger>
								<span
									>{propertyCategories.find((c) => c.value === formData.category)?.label ||
										"Select category"}</span
								>
							</Select.Trigger>
							<Select.Content>
								{#each propertyCategories as category}
									<Select.Item value={category.value}>{category.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if form?.errors?.category}
							<p class="text-sm text-destructive">{form.errors.category[0]}</p>
						{/if}
					</div>
				</div>

				<!-- Description -->
				<div class="space-y-2">
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						name="description"
						bind:value={formData.description}
						placeholder="Describe the property features, amenities, and highlights"
						rows={4}
					/>
					{#if form?.errors?.description}
						<p class="text-sm text-destructive">{form.errors.description[0]}</p>
					{/if}
				</div>

				<!-- Price and Areas -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="price">Price (PHP) *</Label>
						<Input
							id="price"
							name="price"
							type="number"
							bind:value={formData.price}
							placeholder="0"
							min="0"
							step="1000"
							required
						/>
						{#if form?.errors?.price}
							<p class="text-sm text-destructive">{form.errors.price[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="landArea">Land Area (sq.m) *</Label>
						<Input
							id="landArea"
							name="landArea"
							type="number"
							bind:value={formData.landArea}
							placeholder="0"
							min="0"
							step="0.01"
							required
						/>
						{#if form?.errors?.landArea}
							<p class="text-sm text-destructive">{form.errors.landArea[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="floorArea">Floor Area (sq.m)</Label>
						<Input
							id="floorArea"
							name="floorArea"
							type="number"
							bind:value={formData.floorArea}
							placeholder="0"
							min="0"
							step="0.01"
						/>
						{#if form?.errors?.floorArea}
							<p class="text-sm text-destructive">{form.errors.floorArea[0]}</p>
						{/if}
					</div>
				</div>

				<!-- Rooms and Parking -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="bedrooms">Bedrooms</Label>
						<Input
							id="bedrooms"
							name="bedrooms"
							type="number"
							bind:value={formData.bedrooms}
							placeholder="0"
							min="0"
						/>
						{#if form?.errors?.bedrooms}
							<p class="text-sm text-destructive">{form.errors.bedrooms[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="bathrooms">Bathrooms</Label>
						<Input
							id="bathrooms"
							name="bathrooms"
							type="number"
							bind:value={formData.bathrooms}
							placeholder="0"
							min="0"
						/>
						{#if form?.errors?.bathrooms}
							<p class="text-sm text-destructive">{form.errors.bathrooms[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="carSpace">Car Spaces</Label>
						<Input
							id="carSpace"
							name="carSpace"
							type="number"
							bind:value={formData.carSpace}
							placeholder="0"
							min="0"
						/>
						{#if form?.errors?.carSpace}
							<p class="text-sm text-destructive">{form.errors.carSpace[0]}</p>
						{/if}
					</div>
				</div>

				<!-- Features and Tags -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="features">Features</Label>
						<Input
							id="features"
							name="features"
							type="text"
							bind:value={formData.features}
							placeholder="e.g., Pool, Garden, Garage (comma-separated)"
						/>
						<p class="text-xs text-muted-foreground">Separate multiple features with commas</p>
						{#if form?.errors?.features}
							<p class="text-sm text-destructive">{form.errors.features[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="tags">Tags</Label>
						<Input
							id="tags"
							name="tags"
							type="text"
							bind:value={formData.tags}
							placeholder="e.g., Modern, Family-friendly, Investment (comma-separated)"
						/>
						<p class="text-xs text-muted-foreground">Separate multiple tags with commas</p>
						{#if form?.errors?.tags}
							<p class="text-sm text-destructive">{form.errors.tags[0]}</p>
						{/if}
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Location Information -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<MapPin class="h-5 w-5" />
					Location Information
				</CardTitle>
				<CardDescription>Update the property address and coordinates</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<!-- Address Fields -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="street">Street Address *</Label>
						<Input
							id="street"
							name="street"
							type="text"
							bind:value={formData.street}
							placeholder="Enter street address"
							required
						/>
						{#if form?.errors?.street}
							<p class="text-sm text-destructive">{form.errors.street[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="barangay">Barangay *</Label>
						<Input
							id="barangay"
							name="barangay"
							type="text"
							bind:value={formData.barangay}
							placeholder="Enter barangay"
							required
						/>
						{#if form?.errors?.barangay}
							<p class="text-sm text-destructive">{form.errors.barangay[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="city">City *</Label>
						<Input
							id="city"
							name="city"
							type="text"
							bind:value={formData.city}
							placeholder="Enter city"
							required
						/>
						{#if form?.errors?.city}
							<p class="text-sm text-destructive">{form.errors.city[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="province">Province *</Label>
						<Select.Root type="single" name="province" bind:value={formData.province} required>
							<Select.Trigger>
								<span
									>{philippineProvinces.find((p) => p.value === formData.province)?.label ||
										"Select province"}</span
								>
							</Select.Trigger>
							<Select.Content>
								{#each philippineProvinces as province}
									<Select.Item value={province.value}>{province.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if form?.errors?.province}
							<p class="text-sm text-destructive">{form.errors.province[0]}</p>
						{/if}
					</div>
				</div>

				<!-- Location Search -->
				<div class="space-y-2">
					<Label for="locationSearch">Search Location</Label>
					<div class="flex gap-2">
						<Input
							id="locationSearch"
							type="text"
							bind:value={searchQuery}
							placeholder="Search for location..."
							class="flex-1"
						/>
						<Button
							type="button"
							variant="outline"
							onclick={searchLocation}
							disabled={searchLoading}
						>
							{searchLoading ? "Searching..." : "Search"}
						</Button>
					</div>
				</div>

				<!-- Coordinates -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="latitude">Latitude *</Label>
						<Input
							id="latitude"
							name="latitude"
							type="number"
							bind:value={formData.latitude}
							placeholder="e.g., 14.5995"
							step="any"
							onchange={updateMapFromCoordinates}
							required
						/>
						{#if form?.errors?.latitude}
							<p class="text-sm text-destructive">{form.errors.latitude[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="longitude">Longitude *</Label>
						<Input
							id="longitude"
							name="longitude"
							type="number"
							bind:value={formData.longitude}
							placeholder="e.g., 120.9842"
							step="any"
							onchange={updateMapFromCoordinates}
							required
						/>
						{#if form?.errors?.longitude}
							<p class="text-sm text-destructive">{form.errors.longitude[0]}</p>
						{/if}
					</div>
				</div>

				<!-- Map -->
				<div class="space-y-2">
					<Label>Location Map</Label>
					<div
						bind:this={mapContainer}
						class="h-80 w-full rounded-lg border bg-muted shadow-sm"
					></div>
					<p class="text-xs text-muted-foreground">
						Click on the map or drag the marker to update coordinates. You can also use the search
						feature above to find locations.
					</p>
				</div>
			</CardContent>
		</Card>

		<!-- Form Actions -->
		<Card>
			<CardContent class="pt-6">
				<div class="flex flex-col justify-between gap-4 sm:flex-row">
					<Button
						type="button"
						variant="outline"
						onclick={() => goto("/agent/listings")}
						class="order-2 sm:order-1"
					>
						Cancel
					</Button>

					<div class="order-1 flex gap-2 sm:order-2">
						<Button type="submit" disabled={loading} class="flex items-center gap-2">
							<Save class="h-4 w-4" />
							{loading ? "Updating..." : "Update Listing"}
						</Button>
					</div>
				</div>

				{#if form?.message}
					<div class="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{form.message}
					</div>
				{/if}
			</CardContent>
		</Card>
	</form>
</div>

<style>
	:global(.leaflet-container) {
		height: 100%;
		width: 100%;
		border-radius: 0.5rem;
		z-index: 1;
	}

	:global(.leaflet-popup-content-wrapper) {
		border-radius: 0.375rem;
	}

	:global(.leaflet-popup-tip) {
		background: white;
	}

	:global(.leaflet-control-zoom) {
		border: none !important;
		border-radius: 0.375rem !important;
	}

	:global(.leaflet-control-zoom a) {
		border-radius: 0.375rem !important;
		border: none !important;
		color: #374151 !important;
	}

	:global(.leaflet-control-zoom a:hover) {
		background-color: #f3f4f6 !important;
	}
</style>

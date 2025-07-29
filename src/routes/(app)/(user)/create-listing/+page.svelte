<script lang="ts">
	import { enhance } from "$app/forms";
	import { moreEnhance } from "$lib/states/enhance.svelte";
	import type L from "leaflet";
	import "leaflet/dist/leaflet.css";
	import { onMount } from "svelte";

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
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import AgentSelectionGrid from "$lib/components/listings-page/agent-selection-grid.svelte";

	let { data, form } = $props();

	let loading = $state(false);
	let formData = $state({
		// Property details
		name: form?.data?.name || "",
		description: form?.data?.description || "",
		type: form?.data?.type || "",
		category: form?.data?.category || "",
		agentId: form?.data?.agentId?.toString() || "",
		price: form?.data?.price || "",
		landArea: form?.data?.landArea || "",
		floorArea: form?.data?.floorArea || "",
		bedrooms: form?.data?.bedrooms || "",
		bathrooms: form?.data?.bathrooms || "",
		carSpace: form?.data?.carSpace || "",
		// Address details
		street: form?.data?.street || "",
		barangay: form?.data?.barangay || "",
		city: form?.data?.city || "",
		province: form?.data?.province || "",
		// Location coordinates
		latitude: form?.data?.latitude || "",
		longitude: form?.data?.longitude || "",
		// Features and tags (as comma-separated strings for the UI)
		features: form?.data?.features?.join(", ") || "",
		tags: form?.data?.tags?.join(", ") || "",
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
	let map: L.Map;
	let marker: L.Marker;
	let searchQuery = $state("");
	let searchLoading = $state(false);

	// Generate search query from address fields
	$effect(() => {
		const addressParts = [
			formData.street,
			formData.barangay,
			formData.city,
			// formData.province,
		].filter(Boolean);

		if (addressParts.length > 0) {
			searchQuery = addressParts.join(", ");
		}
	});

	// Initialize map when container is ready
	async function initializeMap() {
		if (mapContainer) {
			const L = await import("leaflet");
			// Default to Philippines center if no coordinates
			const defaultLat = formData.latitude ? parseFloat(formData.latitude) : 14.5995;
			const defaultLng = formData.longitude ? parseFloat(formData.longitude) : 120.9842;

			// Initialize Leaflet map
			map = L.map(mapContainer).setView([defaultLat, defaultLng], 13);

			// Add OpenStreetMap tiles
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "© OpenStreetMap contributors",
			}).addTo(map);

			// Add marker
			marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

			// Update coordinates when marker is dragged
			marker.on("dragend", function () {
				const position = marker.getLatLng();
				formData.latitude = position.lat.toString();
				formData.longitude = position.lng.toString();
			});

			// Update marker position when map is clicked
			map.on("click", function (e: L.LeafletMouseEvent) {
				const { lat, lng } = e.latlng;
				marker.setLatLng([lat, lng]);
				formData.latitude = lat.toString();
				formData.longitude = lng.toString();
			});
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
				const { lat, lon } = results[0];
				const latitude = parseFloat(lat);
				const longitude = parseFloat(lon);

				// Update coordinates
				formData.latitude = latitude.toString();
				formData.longitude = longitude.toString();

				// Update map if initialized
				if (map && marker) {
					map.setView([latitude, longitude], 15);
					marker.setLatLng([latitude, longitude]);
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

	// Update map location based on address fields
	function updateMapFromCoordinates() {
		const lat = parseFloat(formData.latitude);
		const lng = parseFloat(formData.longitude);

		if (!isNaN(lat) && !isNaN(lng) && map && marker) {
			map.setView([lat, lng], 13);
			marker.setLatLng([lat, lng]);
		}
	}
	// $inspect(formData);

	// ai tools
	let aiDescriptionButton: HTMLElement | undefined = $state();
	let aiAppraisalButton: HTMLElement | undefined = $state();

	const createDescForm = moreEnhance({
		reset: false,
		onSubmitted: (res: any) => {
			if (res.description) {
				formData.description = res.description;
			}
		},
	});
	const analyzePriceForm = moreEnhance({
		reset: false,
		onSubmitted: (res: any) => {
			if (res.price) {
				formData.price = res.price;
			}
		},
	});
</script>

<svelte:head>
	<title>Create Listing - JuanHome</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mx-auto max-w-4xl space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-gray-900">Create New Listing</h1>
			<p class="mt-2 text-sm text-gray-600">Add a new property to the market</p>
		</div>

		<form
			method="POST"
			action="?/create-listing"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
			class="space-y-8"
		>
			<!-- Property Information -->
			<Card>
				<CardHeader>
					<CardTitle>Property Information</CardTitle>
					<CardDescription>Basic details about the property</CardDescription>
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
							class={form?.errors?.name ? "border-red-500" : ""}
							required
						/>
						{#if form?.errors?.name}
							<p class="text-sm text-red-600">{form.errors.name[0]}</p>
						{/if}
					</div>

					<!-- Property Type and Category -->
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="type">Property Type *</Label>
							<Select type="single" name="type" bind:value={formData.type}>
								<SelectTrigger class={form?.errors?.type ? "border-red-500" : ""}>
									{propertyTypes.find((pt) => pt.value === formData.type)?.label ||
										"Select property type"}
								</SelectTrigger>
								<SelectContent>
									{#each propertyTypes as propertyType (propertyType)}
										<SelectItem value={propertyType.value}>{propertyType.label}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
							{#if form?.errors?.type}
								<p class="text-sm text-red-600">{form.errors.type[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="category">Property Category *</Label>
							<Select type="single" name="category" bind:value={formData.category}>
								<SelectTrigger class={form?.errors?.category ? "border-red-500" : ""}>
									{propertyCategories.find((pc) => pc.value === formData.category)?.label ||
										"Select property category"}
								</SelectTrigger>
								<SelectContent>
									{#each propertyCategories as propertyCategory (propertyCategory)}
										<SelectItem value={propertyCategory.value}>{propertyCategory.label}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
							{#if form?.errors?.category}
								<p class="text-sm text-red-600">{form.errors.category[0]}</p>
							{/if}
						</div>
					</div>

					<!-- Property Details Grid -->
					<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
						<div class="space-y-2">
							<Label for="landArea">Land Area (sq.m) *</Label>
							<Input
								id="landArea"
								name="landArea"
								type="number"
								step="0.01"
								min="0"
								bind:value={formData.landArea}
								placeholder="0.00"
								class={form?.errors?.landArea ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.landArea}
								<p class="text-sm text-red-600">{form.errors.landArea[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="floorArea">Floor Area (sq.m)</Label>
							<Input
								id="floorArea"
								name="floorArea"
								type="number"
								step="0.01"
								min="0"
								bind:value={formData.floorArea}
								placeholder="0.00 (optional)"
								class={form?.errors?.floorArea ? "border-red-500" : ""}
							/>
							{#if form?.errors?.floorArea}
								<p class="text-sm text-red-600">{form.errors.floorArea[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="bedrooms">Bedrooms</Label>
							<Input
								id="bedrooms"
								name="bedrooms"
								type="number"
								min="0"
								bind:value={formData.bedrooms}
								placeholder="0"
								class={form?.errors?.bedrooms ? "border-red-500" : ""}
							/>
							{#if form?.errors?.bedrooms}
								<p class="text-sm text-red-600">{form.errors.bedrooms[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="bathrooms">Bathrooms</Label>
							<Input
								id="bathrooms"
								name="bathrooms"
								type="number"
								min="0"
								bind:value={formData.bathrooms}
								placeholder="0"
								class={form?.errors?.bathrooms ? "border-red-500" : ""}
							/>
							{#if form?.errors?.bathrooms}
								<p class="text-sm text-red-600">{form.errors.bathrooms[0]}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="carSpace">Car Spaces</Label>
							<Input
								id="carSpace"
								name="carSpace"
								type="number"
								min="0"
								bind:value={formData.carSpace}
								placeholder="0"
								class={form?.errors?.carSpace ? "border-red-500" : ""}
							/>
							{#if form?.errors?.carSpace}
								<p class="text-sm text-red-600">{form.errors.carSpace[0]}</p>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Address Information -->
			<Card>
				<CardHeader>
					<CardTitle>Address Information</CardTitle>
					<CardDescription>Location details of the property</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="space-y-2 md:col-span-2">
							<Label for="street">Street Address</Label>
							<Input
								id="street"
								name="street"
								type="text"
								bind:value={formData.street}
								placeholder="Enter street address (optional)"
								class={form?.errors?.street ? "border-red-500" : ""}
							/>
							{#if form?.errors?.street}
								<p class="text-sm text-red-600">{form.errors.street[0]}</p>
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
								class={form?.errors?.barangay ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.barangay}
								<p class="text-sm text-red-600">{form.errors.barangay[0]}</p>
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
								class={form?.errors?.city ? "border-red-500" : ""}
								required
							/>
							{#if form?.errors?.city}
								<p class="text-sm text-red-600">{form.errors.city[0]}</p>
							{/if}
						</div>

						<div class="space-y-2 md:col-span-2">
							<Label for="province">Province *</Label>
							<Select type="single" name="province" bind:value={formData.province}>
								<SelectTrigger class={form?.errors?.province ? "border-red-500" : ""}>
									{philippineProvinces.find((p) => p.value === formData.province)?.label ||
										"Select province"}
								</SelectTrigger>
								<SelectContent>
									{#each philippineProvinces as province (province.value)}
										<SelectItem value={province.value}>{province.label}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
							{#if form?.errors?.province}
								<p class="text-sm text-red-600">{form.errors.province[0]}</p>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Agent Selection -->
			<Card>
				<CardHeader>
					<CardTitle>Agent Assignment</CardTitle>
					<CardDescription>Select an agent to handle this property listing</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<!-- Agent Grid -->
						<AgentSelectionGrid
							agents={data.agents}
							bind:selectedAgentId={formData.agentId}
							propertyCity={formData.city}
						/>

						<!-- Hidden input for form submission -->
						<input type="hidden" name="agentId" value={formData.agentId} />

						{#if form?.errors?.agentId}
							<p class="text-sm text-red-600">{form.errors.agentId[0]}</p>
						{/if}
					</div>
				</CardContent>
			</Card>

			<!-- Property Location -->
			<Card>
				<CardHeader>
					<CardTitle>Property Location</CardTitle>
					<CardDescription
						>Search for the property location or click on the map to set the exact coordinates</CardDescription
					>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<!-- Location Search -->
						<div class="space-y-2">
							<Label for="location-search">Search Location</Label>
							<div class="flex gap-2">
								<Input
									id="location-search"
									type="text"
									bind:value={searchQuery}
									placeholder="Enter address or edit auto-generated query"
									class="flex-1"
									onkeydown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											searchLocation();
										}
									}}
								/>
								<Button
									type="button"
									variant="outline"
									onclick={searchLocation}
									disabled={searchLoading || !searchQuery.trim()}
								>
									{#if searchLoading}
										<svg
											class="h-4 w-4 animate-spin"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
											></path>
										</svg>
									{:else}
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											>
											</path>
										</svg>
									{/if}
									Search
								</Button>
							</div>
							<p class="text-xs text-gray-500">
								Search query is automatically generated from address fields above, but you can edit
								it manually
							</p>
						</div>

						<div bind:this={mapContainer} class="relative z-0 h-100 rounded-lg border"></div>

						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="latitude">Latitude</Label>
								<Input
									id="latitude"
									name="latitude"
									type="text"
									bind:value={formData.latitude}
									placeholder="Auto-filled from address"
									class={form?.errors?.latitude ? "border-red-500" : ""}
									required
									readonly
									onchange={() => updateMapFromCoordinates()}
								/>
								{#if form?.errors?.latitude}
									<p class="text-sm text-red-600">{form.errors.latitude[0]}</p>
								{/if}
							</div>

							<div class="space-y-2">
								<Label for="longitude">Longitude</Label>
								<Input
									id="longitude"
									name="longitude"
									type="text"
									bind:value={formData.longitude}
									placeholder="Auto-filled from address"
									class={form?.errors?.longitude ? "border-red-500" : ""}
									readonly
									required
									onchange={() => updateMapFromCoordinates()}
								/>
								{#if form?.errors?.longitude}
									<p class="text-sm text-red-600">{form.errors.longitude[0]}</p>
								{/if}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Features and Tags -->
			<Card>
				<CardHeader>
					<CardTitle>Features and Tags</CardTitle>
					<CardDescription>Additional property details and marketing tags</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div class="space-y-2">
							<Label for="features">Features</Label>
							<Input
								id="features"
								name="features"
								type="text"
								bind:value={formData.features}
								placeholder="Swimming pool, garage, garden (comma-separated)"
								class={form?.errors?.features ? "border-red-500" : ""}
							/>
							{#if form?.errors?.features}
								<p class="text-sm text-red-600">{form.errors.features[0]}</p>
							{/if}
							<p class="text-xs text-gray-500">
								Separate multiple features with commas (e.g., "Swimming pool, Garage, Garden")
							</p>
						</div>

						<div class="space-y-2">
							<Label for="tags">Tags</Label>
							<Input
								id="tags"
								name="tags"
								type="text"
								bind:value={formData.tags}
								placeholder="luxury, modern, family-friendly (comma-separated)"
								class={form?.errors?.tags ? "border-red-500" : ""}
							/>
							{#if form?.errors?.tags}
								<p class="text-sm text-red-600">{form.errors.tags[0]}</p>
							{/if}
							<p class="text-xs text-gray-500">
								Separate multiple tags with commas (e.g., "Luxury, Modern, Family-friendly")
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Pricing and Description -->
			<Card>
				<CardHeader>
					<CardTitle>Pricing and Description</CardTitle>
					<CardDescription>Set the price and describe your property using AI assistance</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<!-- Price Section -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="price">Price *</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								class="text-xs"
								disabled={analyzePriceForm.submitting}
								onclick={() => {
									if (aiAppraisalButton) {
										aiAppraisalButton.click();
									}
								}}
							>
								<svg
									class="mr-1.5 h-3.5 w-3.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.849-1.53l-.547-.547z"
									></path>
								</svg>
								AI Price Appraisal
							</Button>
						</div>
						<div class="relative">
							<span class="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-500">₱</span>
							<Input
								id="price"
								name="price"
								type="number"
								step="0.01"
								min="0"
								bind:value={formData.price}
								placeholder="0.00"
								class="pl-8 {form?.errors?.price ? 'border-red-500' : ''}"
								required
							/>
						</div>
						{#if form?.errors?.price}
							<p class="text-sm text-red-600">{form.errors.price[0]}</p>
						{/if}
						<p class="text-xs text-gray-500">Enter the property price in Philippine Peso (₱)</p>
					</div>

					<!-- Description Section -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="description">Property Description</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								class="text-xs"
								disabled={createDescForm.submitting}
								onclick={() => {
									if (aiDescriptionButton) {
										aiDescriptionButton.click();
									}
								}}
							>
								{#if createDescForm.submitting}
									<svg
										class="mr-1.5 h-3.5 w-3.5 animate-spin"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										></path>
									</svg>
									Generating...
								{:else}
									<svg
										class="mr-1.5 h-3.5 w-3.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										></path>
									</svg>
									Generate with AI
								{/if}
							</Button>
						</div>
						<textarea
							id="description"
							name="description"
							bind:value={formData.description}
							placeholder="Describe the property features, amenities, and unique selling points..."
							class="flex min-h-[120px] w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 {form
								?.errors?.description
								? 'border-red-500'
								: ''}"
						></textarea>
						{#if form?.errors?.description}
							<p class="text-sm text-red-600">{form.errors.description[0]}</p>
						{/if}
					</div>
				</CardContent>
			</Card>

			<!-- Submit Button -->
			<div class="flex justify-center">
				<Button type="submit" class="w-full max-w-md" disabled={loading}>
					{#if loading}
						<svg
							class="mr-2 h-4 w-4 animate-spin"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							></path>
						</svg>
						Creating Listing...
					{:else}
						Create Listing
					{/if}
				</Button>
			</div>
		</form>

		<!-- Hidden forms for AI functionality -->
		<form
			method="POST"
			action="?/generate-ai-description"
			class="hidden"
			use:createDescForm.enhance
		>
			<input type="hidden" name="name" value={formData.name} />
			<input type="hidden" name="type" value={formData.type} />
			<input type="hidden" name="category" value={formData.category} />
			<input type="hidden" name="landArea" value={formData.landArea} />
			<input type="hidden" name="floorArea" value={formData.floorArea} />
			<input type="hidden" name="bedrooms" value={formData.bedrooms} />
			<input type="hidden" name="bathrooms" value={formData.bathrooms} />
			<input type="hidden" name="carSpace" value={formData.carSpace} />
			<input type="hidden" name="features" value={formData.features} />
			<input type="hidden" name="tags" value={formData.tags} />
			<input type="hidden" name="street" value={formData.street} />
			<input type="hidden" name="barangay" value={formData.barangay} />
			<input type="hidden" name="city" value={formData.city} />
			<input type="hidden" name="province" value={formData.province} />
			<button type="submit" class="hidden" bind:this={aiDescriptionButton}>Generate AI Description</button>
		</form>

		<form
			method="POST"
			action="?/generate-ai-price"
			class="hidden"
			use:analyzePriceForm.enhance
		>
			<input type="hidden" name="name" value={formData.name} />
			<input type="hidden" name="type" value={formData.type} />
			<input type="hidden" name="category" value={formData.category} />
			<input type="hidden" name="landArea" value={formData.landArea} />
			<input type="hidden" name="floorArea" value={formData.floorArea} />
			<input type="hidden" name="bedrooms" value={formData.bedrooms} />
			<input type="hidden" name="bathrooms" value={formData.bathrooms} />
			<input type="hidden" name="carSpace" value={formData.carSpace} />
			<input type="hidden" name="features" value={formData.features} />
			<input type="hidden" name="tags" value={formData.tags} />
			<input type="hidden" name="street" value={formData.street} />
			<input type="hidden" name="barangay" value={formData.barangay} />
			<input type="hidden" name="city" value={formData.city} />
			<input type="hidden" name="province" value={formData.province} />
			<button type="submit" class="hidden" bind:this={aiAppraisalButton}>Generate AI Description</button>
		</form>
	</div>
</div>

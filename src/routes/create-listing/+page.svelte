<script lang="ts">
	import { enhance } from "$app/forms";
	import { moreEnhance } from "$lib/states/enhance.svelte";

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
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
	} from "$lib/components/ui/select";

	let { data, form } = $props();

	let loading = $state(false);
	let formData = $state({
		// Property details
		name: form?.data?.name || "",
		description: form?.data?.description || "",
		type: form?.data?.type || "",
		category: form?.data?.category || "",
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
		tags: form?.data?.tags?.join(", ") || ""
	});

	const propertyTypes = [
		{ value: "rent", label: "For Rent" },
		{ value: "sale", label: "For Sale" },
		{ value: "lease", label: "For Lease" }
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
		{ value: "industrial-lot", label: "Industrial Lot" }
	];

	// Map state
	let mapContainer: HTMLDivElement;
	let map: any;
	let marker: any;

	// Initialize map when container is ready
	function initializeMap() {
		if (typeof window !== 'undefined' && mapContainer) {
			// Default to Philippines center if no coordinates
			const defaultLat = formData.latitude ? parseFloat(formData.latitude) : 14.5995;
			const defaultLng = formData.longitude ? parseFloat(formData.longitude) : 120.9842;

			// Initialize Leaflet map
			map = window.L.map(mapContainer).setView([defaultLat, defaultLng], 13);

			// Add OpenStreetMap tiles
			window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);

			// Add marker
			marker = window.L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

			// Update coordinates when marker is dragged
			marker.on('dragend', function() {
				const position = marker.getLatLng();
				formData.latitude = position.lat.toString();
				formData.longitude = position.lng.toString();
			});

			// Update marker position when map is clicked
			map.on('click', function(e: any) {
				const { lat, lng } = e.latlng;
				marker.setLatLng([lat, lng]);
				formData.latitude = lat.toString();
				formData.longitude = lng.toString();
			});
		}
	}

	// Load Leaflet CSS and JS
	function loadLeaflet() {
		if (typeof window !== 'undefined' && !window.L) {
			// Load Leaflet CSS
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);

			// Load Leaflet JS
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
			script.onload = () => {
				setTimeout(initializeMap, 100);
			};
			document.head.appendChild(script);
		} else if (window.L) {
			setTimeout(initializeMap, 100);
		}
	}

	// Load the map when component mounts
	$effect(() => {
		if (typeof window !== 'undefined') {
			loadLeaflet();
		}
	});

	// Search for location using Nominatim (OpenStreetMap's geocoding service)
	async function searchLocation(query) {
		if (!query.trim()) return;

		try {
			// Use Nominatim API for free geocoding
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=ph`
			);

			const results = await response.json();

			if (results && results.length > 0) {
				const location = results[0];
				const lat = parseFloat(location.lat);
				const lng = parseFloat(location.lon);

				// Update form data
				formData.latitude = lat.toString();
				formData.longitude = lng.toString();

				// Update map view and marker
				if (map && marker) {
					map.setView([lat, lng], 15);
					marker.setLatLng([lat, lng]);
				}
			} else {
				console.warn('No results found for:', query);
				// You could show a user-friendly message here
			}
		} catch (error) {
			console.error('Geocoding error:', error);
			// You could show an error message to the user here
		}
	}

	// Update map location based on address fields
	async function updateLocationFromAddress() {
		// Build address string from form fields
		const addressParts = [
			formData.street,
			formData.barangay,
			formData.city,
			formData.province
		].filter(part => part && part.trim().length > 0);

		if (addressParts.length < 2) return; // Need at least 2 address components

		const addressQuery = addressParts.join(', ') + ', Philippines';
		await searchLocation(addressQuery);
	}

	function updateMapFromCoordinates() {
		const lat = parseFloat(formData.latitude);
		const lng = parseFloat(formData.longitude);

		if (!isNaN(lat) && !isNaN(lng) && map && marker) {
			map.setView([lat, lng], 13);
			marker.setLatLng([lat, lng]);
		}
	}

	// ai tools
	let aiDescriptionButton: HTMLElement | undefined = $state()
	let aiAppraisalButton: HTMLElement | undefined = $state()
	const generateWithAI = moreEnhance({
		reset: false,
		onSubmitted: (res) => {
			if (res?.description) {
				formData.description = res.description
			} else if (res?.price) {
				formData.price = res.price
			} else {
				console.error("AI generation failed:", res);
			}
		}
	})
	const { enhance: listingEnhance, submitting: listingSubmitting } = $derived(generateWithAI);
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
							<Select
								type="single"
								name="type"
								bind:value={formData.type}
							>
								<SelectTrigger class={form?.errors?.type ? "border-red-500" : ""}>
									{propertyTypes.find(pt => pt.value === formData.type)?.label || "Select property type"}
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
							<Select
								type="single"
								name="category"
								bind:value={formData.category}
							>
								<SelectTrigger class={form?.errors?.category ? "border-red-500" : ""}>
									{propertyCategories.find(pc => pc.value === formData.category)?.label || "Select property category"}
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

					<!-- Price Section -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="price">Price *</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								class="text-xs"
								disabled={listingSubmitting}
								onclick={() => {
									if (aiAppraisalButton) {
										aiAppraisalButton.click();
									}
								}}
							>
								<svg class="mr-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.849-1.53l-.547-.547z"></path>
								</svg>
								AI Price Appraisal
							</Button>
						</div>
						<div class="relative">
							<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₱</span>
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

					<!-- Description Section -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="description">Property Description</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								class="text-xs"
								disabled={listingSubmitting}
								onclick={() => {
									if (aiDescriptionButton) {
										aiDescriptionButton.click();
									}
								}}
							>
								{#if listingSubmitting}
									<svg class="mr-1.5 h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
									</svg>
									Generating...
								{:else}
									<svg class="mr-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
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
							class="border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex min-h-[120px] w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] {form?.errors?.description ? 'border-red-500' : ''}"
						></textarea>
						{#if form?.errors?.description}
							<p class="text-sm text-red-600">{form.errors.description[0]}</p>
						{/if}
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
								onblur={() => updateLocationFromAddress()}
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
								onblur={() => updateLocationFromAddress()}
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
								onblur={() => updateLocationFromAddress()}
							/>
							{#if form?.errors?.city}
								<p class="text-sm text-red-600">{form.errors.city[0]}</p>
							{/if}
						</div>

						<div class="space-y-2 md:col-span-2">
							<Label for="province">Province *</Label>
							<Input
								id="province"
								name="province"
								type="text"
								bind:value={formData.province}
								placeholder="Enter province"
								class={form?.errors?.province ? "border-red-500" : ""}
								required
								onblur={() => updateLocationFromAddress()}
							/>
							{#if form?.errors?.province}
								<p class="text-sm text-red-600">{form.errors.province[0]}</p>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Property Location -->
			<Card>
				<CardHeader>
					<CardTitle>Property Location</CardTitle>
					<CardDescription>The map will automatically update based on your address information above</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div
							bind:this={mapContainer}
							class="h-60 rounded-lg border"
						></div>

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
									onchange={() => updateMapFromCoordinates()}
									readonly
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
									required
									onchange={() => updateMapFromCoordinates()}
									readonly
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
								placeholder="e.g., Swimming Pool, Garden, Balcony (comma-separated)"
								class={form?.errors?.features ? "border-red-500" : ""}
							/>
							{#if form?.errors?.features}
								<p class="text-sm text-red-600">{form.errors.features[0]}</p>
							{/if}
							<p class="text-xs text-gray-500">Separate multiple features with commas</p>
						</div>

						<div class="space-y-2">
							<Label for="tags">Tags</Label>
							<Input
								id="tags"
								name="tags"
								type="text"
								bind:value={formData.tags}
								placeholder="e.g., Modern, Luxury, Pet-Friendly (comma-separated)"
								class={form?.errors?.tags ? "border-red-500" : ""}
							/>
							{#if form?.errors?.tags}
								<p class="text-sm text-red-600">{form.errors.tags[0]}</p>
							{/if}
							<p class="text-xs text-gray-500">Separate multiple tags with commas</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Form Actions -->
			<div class="flex justify-end space-x-4">
				<Button type="button" variant="outline" onclick={() => history.back()}>
					Cancel
				</Button>
				<Button type="submit" disabled={loading}>
					{loading ? "Creating..." : "Create Listing"}
				</Button>
			</div>

			{#if form?.message}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Error</h3>
							<div class="mt-2 text-sm text-red-700">
								<p>{form.message}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</form>
	</div>
</div>

<form
	class="hidden"
	method="POST"
	action="?/generate-ai-description"
	use:listingEnhance
>
	<input type="hidden" name="name" value={formData.name} />
	<input type="hidden" name="type" value={formData.type} />
	<input type="hidden" name="category" value={formData.category} />
	<input type="hidden" name="price" value={formData.price} />
	<input type="hidden" name="landArea" value={formData.landArea} />
	<input type="hidden" name="floorArea" value={formData.floorArea} />
	<input type="hidden" name="bedrooms" value={formData.bedrooms} />
	<input type="hidden" name="bathrooms" value={formData.bathrooms} />
	<input type="hidden" name="carSpace" value={formData.carSpace} />
	<input type="hidden" name="street" value={formData.street} />
	<input type="hidden" name="barangay" value={formData.barangay} />
	<input type="hidden" name="city" value={formData.city} />
	<input type="hidden" name="province" value={formData.province} />
	<input type="hidden" name="latitude" value={formData.latitude} />
	<input type="hidden" name="longitude" value={formData.longitude} />
	<input type="hidden" name="features" value={formData.features} />
	<input type="hidden" name="tags" value={formData.tags} />
	<button type="submit" class="hidden" bind:this={aiDescriptionButton}>Generate AI Description</button>
</form>

<form
	class="hidden"
	method="POST"
	action="?/generate-ai-price"
	use:listingEnhance
>
	<input type="hidden" name="name" value={formData.name} />
	<input type="hidden" name="type" value={formData.type} />
	<input type="hidden" name="category" value={formData.category} />
	<input type="hidden" name="landArea" value={formData.landArea} />
	<input type="hidden" name="floorArea" value={formData.floorArea} />
	<input type="hidden" name="bedrooms" value={formData.bedrooms} />
	<input type="hidden" name="bathrooms" value={formData.bathrooms} />
	<input type="hidden" name="carSpace" value={formData.carSpace} />
	<input type="hidden" name="street" value={formData.street} />
	<input type="hidden" name="barangay" value={formData.barangay} />
	<input type="hidden" name="city" value={formData.city} />
	<input type="hidden" name="province" value={formData.province} />
	<input type="hidden" name="latitude" value={formData.latitude} />
	<input type="hidden" name="longitude" value={formData.longitude} />
	<input type="hidden" name="features" value={formData.features} />
	<input type="hidden" name="tags" value={formData.tags} />
	<button type="submit" class="hidden" bind:this={aiAppraisalButton}>Generate AI Description</button>
</form>

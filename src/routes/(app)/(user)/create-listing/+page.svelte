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
	// Agent grid imports
	import CredentialsFilter from "$lib/components/listings-page/filter-agent-credentials.svelte";
	import ExperienceFilter from "$lib/components/listings-page/filter-agent-experience.svelte";
	import LocationFilter from "$lib/components/listings-page/filter-location.svelte";
	import SortAgents from "$lib/components/listings-page/sort-agents.svelte";
	import { Check, ChevronDown, ChevronUp, Funnel, RotateCcw, Search } from "@lucide/svelte";

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
		// Photo URLs (as comma-separated strings for the UI)
		photosUrls: form?.data?.photosUrls?.join(", ") || "",
	});

	// Agent selection filters
	let agentSearchTerm = $state("");
	let agentLocation = $state("All Locations");
	let agentCredential = $state("All Credentials");
	let agentExperience = $state("Any Experience");
	let agentSortBy = $state("Relevance");
	let showAgentFilters = $state(false);
	let selectedAgentId = $state(formData.agentId);

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

	const agents = $derived(
		data.agents.sort((a) => {
			if (a.user.address.city.toLowerCase().includes(formData.city.toLowerCase())) {
				return -1;
			}
			return 0;
		}),
	);

	// Agent filtering functions
	function filterAgents(agents: typeof data.agents) {
		return agents
			.filter((agent) => {
				// Search term filter
				const fullName = `${agent.user.firstName} ${agent.user.lastName}`.toLowerCase();
				const agentLocationStr = Object.values(agent.user.address).join(",");

				const matchesSearch =
					agentSearchTerm.trim() === "" ||
					fullName.includes(agentSearchTerm.toLowerCase()) ||
					agent.user.email.toLowerCase().includes(agentSearchTerm.toLowerCase()) ||
					agent.about?.toLowerCase().includes(agentSearchTerm.toLowerCase()) ||
					agentLocationStr.toLowerCase().includes(agentSearchTerm.toLowerCase());

				// Location filter
				const matchesLocation =
					agentLocation === "All Locations" || agentLocationStr.includes(agentLocation);

				// Credential filter
				const matchesCredential =
					agentCredential === "All Credentials" || agent.credentials === agentCredential;

				// Experience filter
				const agentExperienceYears = getExperienceYears(agent.user.dateCreated);
				const matchesExp = matchesExperience(agentExperienceYears, agentExperience);

				return matchesSearch && matchesLocation && matchesCredential && matchesExp;
			})
			.sort((a, b) => {
				switch (agentSortBy) {
					case "Relevance":
						// Sort by city match first, then alphabetically
						const aMatchesCity = a.user.address.city
							.toLowerCase()
							.includes(formData.city.toLowerCase());
						const bMatchesCity = b.user.address.city
							.toLowerCase()
							.includes(formData.city.toLowerCase());
						if (aMatchesCity && !bMatchesCity) return -1;
						if (!aMatchesCity && bMatchesCity) return 1;
						return `${a.user.firstName} ${a.user.lastName}`.localeCompare(
							`${b.user.firstName} ${b.user.lastName}`,
						);
					case "Most Experienced":
						return getExperienceYears(b.user.dateCreated) - getExperienceYears(a.user.dateCreated);
					case "Name A-Z":
						return `${a.user.firstName} ${a.user.lastName}`.localeCompare(
							`${b.user.firstName} ${b.user.lastName}`,
						);
					case "Name Z-A":
						return `${b.user.firstName} ${b.user.lastName}`.localeCompare(
							`${a.user.firstName} ${a.user.lastName}`,
						);
					default:
						return 0;
				}
			});
	}

	function getExperienceYears(dateCreated: Date) {
		return new Date().getFullYear() - dateCreated.getFullYear();
	}

	function matchesExperience(agentExperience: number, filter: string) {
		switch (filter) {
			case "0-2 years":
				return agentExperience <= 2;
			case "3-5 years":
				return agentExperience >= 3 && agentExperience <= 5;
			case "6-10 years":
				return agentExperience >= 6 && agentExperience <= 10;
			case "10+ years":
				return agentExperience >= 10;
			default:
				return true;
		}
	}

	function resetAgentFilters() {
		agentSearchTerm = "";
		agentLocation = "All Locations";
		agentCredential = "All Credentials";
		agentExperience = "Any Experience";
		agentSortBy = "Relevance";
	}

	function selectAgent(agentId: string) {
		selectedAgentId = agentId;
		formData.agentId = agentId;
	}

	const filteredAgents = $derived(filterAgents(agents));

	// Keep selectedAgentId and formData.agentId in sync
	$effect(() => {
		if (formData.agentId && !selectedAgentId) {
			selectedAgentId = formData.agentId;
		}
	});

	// Parse photo URLs for preview
	const photoUrls = $derived(() => {
		if (!formData.photosUrls.trim()) return [];
		return formData.photosUrls
			.split(/[,\n]/)
			.map((url: string) => url.trim())
			.filter((url: string) => url.length > 0);
	});

	// Todo list-style states for features, tags, and photos
	let newFeature = $state("");
	let newTag = $state("");
	let newPhotoUrl = $state("");

	// Parse comma-separated strings into arrays for todo list display
	const featuresList = $derived(() => {
		if (!formData.features.trim()) return [];
		return formData.features
			.split(",")
			.map((f: string) => f.trim())
			.filter((f: string) => f.length > 0);
	});

	const tagsList = $derived(() => {
		if (!formData.tags.trim()) return [];
		return formData.tags
			.split(",")
			.map((t: string) => t.trim())
			.filter((t: string) => t.length > 0);
	});

	// Functions to manage features
	function addFeature() {
		if (newFeature.trim()) {
			const currentFeatures = featuresList();
			currentFeatures.push(newFeature.trim());
			formData.features = currentFeatures.join(", ");
			newFeature = "";
		}
	}

	function removeFeature(index: number) {
		const currentFeatures = featuresList();
		currentFeatures.splice(index, 1);
		formData.features = currentFeatures.join(", ");
	}

	// Functions to manage tags
	function addTag() {
		if (newTag.trim()) {
			const currentTags = tagsList();
			currentTags.push(newTag.trim());
			formData.tags = currentTags.join(", ");
			newTag = "";
		}
	}

	function removeTag(index: number) {
		const currentTags = tagsList();
		currentTags.splice(index, 1);
		formData.tags = currentTags.join(", ");
	}

	// Functions to manage photos
	function addPhotoUrl() {
		if (newPhotoUrl.trim()) {
			const currentUrls = photoUrls();
			const newUrlList = [...currentUrls, newPhotoUrl.trim()];
			formData.photosUrls = newUrlList.join(", ");
			newPhotoUrl = "";
		}
	}

	function removePhotoUrl(index: number) {
		const currentUrls = photoUrls();
		currentUrls.splice(index, 1);
		formData.photosUrls = currentUrls.join(", ");
	}
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
				<CardContent class="space-y-4">
					<!-- Selected Agent Display -->
					{#if selectedAgentId}
						{@const selectedAgent = data.agents.find(
							(agent) => agent.user.id.toString() === selectedAgentId,
						)}
						{#if selectedAgent}
							<div class="rounded-lg border border-green-200 bg-green-50 p-4">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"
										>
											<Check class="h-5 w-5 text-green-600" />
										</div>
										<div>
											<p class="font-medium text-green-900">
												{selectedAgent.user.firstName}
												{selectedAgent.user.lastName}
											</p>
											<p class="text-sm text-green-700">Selected as listing agent</p>
										</div>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onclick={() => {
											selectedAgentId = "";
											formData.agentId = "";
										}}
									>
										Change Agent
									</Button>
								</div>
							</div>
						{/if}
					{/if}

					<!-- Hidden input for form submission -->
					<input type="hidden" name="agentId" bind:value={formData.agentId} />
					{#if form?.errors?.agentId}
						<p class="text-sm text-red-600">{form.errors.agentId[0]}</p>
					{/if}

					<!-- Search Bar -->
					<div class="space-y-2">
						<Label for="agent-search">Search Agents</Label>
						<div class="relative">
							<Search
								class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="agent-search"
								bind:value={agentSearchTerm}
								placeholder="Search agents by name, email, or location..."
								class="h-10 pl-9"
							/>
						</div>
					</div>

					<!-- Agent Filters -->
					<div class="space-y-4">
						<!-- Mobile: Collapsible filters -->
						<div class="lg:hidden">
							<Button
								type="button"
								variant="outline"
								size="sm"
								class="flex w-full items-center justify-between gap-2"
								onclick={() => (showAgentFilters = !showAgentFilters)}
							>
								<div class="flex items-center gap-2">
									<Funnel class="h-4 w-4" />
									<span>Advanced Filters</span>
								</div>
								{#if showAgentFilters}
									<ChevronUp class="h-4 w-4" />
								{:else}
									<ChevronDown class="h-4 w-4" />
								{/if}
							</Button>

							<!-- Collapsible Filters -->
							{#if showAgentFilters}
								<div class="mt-3 flex flex-col gap-3">
									<!-- Filter Row -->
									<div class="flex flex-wrap items-center gap-2">
										<div class="min-w-0 flex-1">
											<LocationFilter bind:location={agentLocation} />
										</div>
										<div class="min-w-0 flex-1">
											<CredentialsFilter bind:credential={agentCredential} />
										</div>
									</div>
									<!-- Filter Row 2 -->
									<div class="flex flex-wrap items-center gap-2">
										<div class="min-w-0 flex-1">
											<ExperienceFilter bind:experience={agentExperience} />
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											class="flex items-center gap-1 px-3"
											onclick={resetAgentFilters}
										>
											<RotateCcw class="h-4 w-4" />
											Reset
										</Button>
									</div>
								</div>
							{/if}
						</div>

						<!-- Desktop: Single row layout -->
						<div class="hidden items-center gap-3 lg:flex">
							<LocationFilter bind:location={agentLocation} />
							<CredentialsFilter bind:credential={agentCredential} />
							<ExperienceFilter bind:experience={agentExperience} />
							<SortAgents bind:sortBy={agentSortBy} />
							<Button
								type="button"
								variant="outline"
								class="flex items-center gap-2"
								onclick={resetAgentFilters}
							>
								<RotateCcw class="h-4 w-4" />
								Reset
							</Button>
						</div>
					</div>

					<!-- Agent Grid -->
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<p class="text-sm text-muted-foreground">
								{filteredAgents.length} agents available
								{#if selectedAgentId}• 1 selected{/if}
							</p>
							<div class="lg:hidden">
								<SortAgents bind:sortBy={agentSortBy} />
							</div>
						</div>

						{#if filteredAgents.length > 0}
							<div class="max-h-96 w-full overflow-y-auto p-2">
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
									{#each filteredAgents as agent (agent.user.id)}
										<div class="relative">
											<button
												type="button"
												class="w-full text-left transition-all {selectedAgentId ===
												agent.user.id.toString()
													? 'ring-2 ring-green-500 ring-offset-2'
													: 'hover:scale-[1.02]'}"
												onclick={() => selectAgent(agent.user.id.toString())}
											>
												<div
													class="relative overflow-hidden rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
												>
													{#if selectedAgentId === agent.user.id.toString()}
														<div
															class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500"
														>
															<Check class="h-4 w-4 text-white" />
														</div>
													{/if}

													<div class="flex items-start gap-3">
														<!-- Profile Image Placeholder -->
														<div
															class="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600"
														>
															<span class="font-medium text-white">
																{agent.user.firstName.charAt(0)}{agent.user.lastName.charAt(0)}
															</span>
														</div>

														<div class="min-w-0 flex-1">
															<h4 class="truncate font-medium text-gray-900">
																{agent.user.firstName}
																{agent.user.lastName}
															</h4>
															{#if agent.prcLicenceNumber}
																<p class="text-xs text-gray-500">
																	PRC License: {agent.prcLicenceNumber}
																</p>
															{/if}
															{#if agent.user.address}
																<p class="truncate text-xs text-gray-400">
																	{Object.values(agent.user.address)
																		.slice(1)
																		.filter(Boolean)
																		.join(", ")}
																</p>
															{/if}
														</div>
													</div>
												</div>
											</button>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<div class="flex flex-col items-center justify-center py-8 text-center">
								<div class="mb-4 text-muted-foreground">
									<svg
										class="mx-auto mb-4 h-12 w-12"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1"
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
									<h3 class="mb-2 text-lg font-medium">No agents found</h3>
									<p class="text-sm text-muted-foreground">
										Try adjusting your search criteria or filters
									</p>
								</div>
								<Button type="button" onclick={resetAgentFilters} variant="outline">
									<RotateCcw class="mr-2 h-4 w-4" />
									Clear all filters
								</Button>
							</div>
						{/if}
					</div>

					<p class="text-xs text-gray-500">
						Choose an agent to handle this listing. Agents from the same city as your property are
						shown first.
					</p>
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
											></path>
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
						<!-- Features Section -->
						<div class="space-y-4">
							<Label>Property Features</Label>

							<!-- Add New Feature -->
							<div class="flex gap-2">
								<Input
									bind:value={newFeature}
									placeholder="e.g., Swimming Pool, Garden, Balcony"
									class="flex-1"
									onkeydown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addFeature();
										}
									}}
								/>
								<Button type="button" size="sm" onclick={addFeature} disabled={!newFeature.trim()}>
									Add
								</Button>
							</div>

							<!-- Features List -->
							{#if featuresList().length > 0}
								<div class="space-y-2">
									<div class="max-h-40 space-y-2 overflow-y-auto">
										{#each featuresList() as feature, index}
											<div
												class="flex items-center justify-between rounded-md border bg-gray-50 px-3 py-2"
											>
												<span class="text-sm">{feature}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													class="h-6 w-6 p-0 text-red-500 hover:text-red-700"
													onclick={() => removeFeature(index)}
												>
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M6 18L18 6M6 6l12 12"
														></path>
													</svg>
												</Button>
											</div>
										{/each}
									</div>
									<p class="text-xs text-gray-500">{featuresList().length} feature(s) added</p>
								</div>
							{:else}
								<div class="py-4 text-center text-sm text-gray-500">
									No features added yet. Start by typing a feature above.
								</div>
							{/if}

							<!-- Hidden input for form submission -->
							<input type="hidden" name="features" bind:value={formData.features} />
							{#if form?.errors?.features}
								<p class="text-sm text-red-600">{form.errors.features[0]}</p>
							{/if}
						</div>

						<!-- Tags Section -->
						<div class="space-y-4">
							<Label>Marketing Tags</Label>

							<!-- Add New Tag -->
							<div class="flex gap-2">
								<Input
									bind:value={newTag}
									placeholder="e.g., Modern, Luxury, Pet-Friendly"
									class="flex-1"
									onkeydown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addTag();
										}
									}}
								/>
								<Button type="button" size="sm" onclick={addTag} disabled={!newTag.trim()}>
									Add
								</Button>
							</div>

							<!-- Tags List -->
							{#if tagsList().length > 0}
								<div class="space-y-2">
									<div class="max-h-40 space-y-2 overflow-y-auto">
										{#each tagsList() as tag, index}
											<div
												class="flex items-center justify-between rounded-md border bg-blue-50 px-3 py-2"
											>
												<span class="text-sm text-blue-700">{tag}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													class="h-6 w-6 p-0 text-red-500 hover:text-red-700"
													onclick={() => removeTag(index)}
												>
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M6 18L18 6M6 6l12 12"
														></path>
													</svg>
												</Button>
											</div>
										{/each}
									</div>
									<p class="text-xs text-gray-500">{tagsList().length} tag(s) added</p>
								</div>
							{:else}
								<div class="py-4 text-center text-sm text-gray-500">
									No tags added yet. Start by typing a tag above.
								</div>
							{/if}

							<!-- Hidden input for form submission -->
							<input type="hidden" name="tags" bind:value={formData.tags} />
							{#if form?.errors?.tags}
								<p class="text-sm text-red-600">{form.errors.tags[0]}</p>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Property Photos -->
			<Card>
				<CardHeader>
					<CardTitle>Property Photos</CardTitle>
					<CardDescription>Add photo URLs to showcase your property</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<!-- Add New Photo URL -->
					<div class="space-y-2">
						<Label>Add Photo URL</Label>
						<div class="flex gap-2">
							<Input
								bind:value={newPhotoUrl}
								placeholder="https://example.com/image.jpg"
								class="flex-1"
								onkeydown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addPhotoUrl();
									}
								}}
							/>
							<Button type="button" size="sm" onclick={addPhotoUrl} disabled={!newPhotoUrl.trim()}>
								Add Photo
							</Button>
						</div>
						<div class="space-y-1">
							<p class="text-xs text-gray-500">
								Enter valid image URLs (JPG, PNG, WEBP). Use image hosting services like Google
								Drive, Imgur, or Cloudinary.
							</p>
							<p class="text-xs text-gray-500">
								💡 <strong>Tip:</strong> Add 3-10 high-quality photos showing different angles, rooms,
								and features.
							</p>
						</div>
					</div>

					<!-- Photos List -->
					{#if photoUrls().length > 0}
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<Label>Added Photos ({photoUrls().length})</Label>
								<span class="text-xs text-gray-500">{photoUrls().length} photo(s) added</span>
							</div>

							<!-- Photo List with Preview -->
							<div class="max-h-96 space-y-3 overflow-y-auto">
								{#each photoUrls() as url, index}
									<div class="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
										<!-- Photo Preview -->
										<div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-white">
											<img
												src={url}
												alt="Property photo {index + 1}"
												class="h-full w-full object-cover"
												loading="lazy"
												onerror={(e) => {
													if (e.target) {
														const target = e.target as HTMLImageElement;
														target.style.display = "none";
														if (target.nextElementSibling) {
															const nextTarget = target.nextElementSibling as HTMLElement;
															nextTarget.style.display = "flex";
														}
													}
												}}
											/>
											<div
												class="hidden h-full w-full items-center justify-center bg-gray-100 text-gray-400"
											>
												<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													></path>
												</svg>
											</div>
										</div>

										<!-- URL Display -->
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-medium">Photo {index + 1}</p>
											<p class="truncate text-xs text-gray-500" title={url}>{url}</p>
										</div>

										<!-- Remove Button -->
										<Button
											type="button"
											variant="ghost"
											size="sm"
											class="h-8 w-8 flex-shrink-0 p-0 text-red-500 hover:text-red-700"
											onclick={() => removePhotoUrl(index)}
										>
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
												></path>
											</svg>
										</Button>
									</div>
								{/each}
							</div>

							<!-- Photo Grid Preview -->
							<div class="space-y-2">
								<Label>Photo Gallery Preview</Label>
								<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
									{#each photoUrls() as url, index}
										<div
											class="relative aspect-square overflow-hidden rounded-lg border bg-gray-50"
										>
											<img
												src={url}
												alt="Property photo {index + 1}"
												class="h-full w-full object-cover transition-transform hover:scale-105"
												loading="lazy"
											/>
											<div class="absolute top-1 right-1">
												<Button
													type="button"
													variant="ghost"
													size="sm"
													class="h-6 w-6 bg-black/50 p-0 text-white hover:bg-black/70"
													onclick={() => removePhotoUrl(index)}
												>
													<svg
														class="h-3 w-3"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M6 18L18 6M6 6l12 12"
														></path>
													</svg>
												</Button>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<div class="py-8 text-center text-gray-500">
							<svg
								class="mx-auto mb-4 h-12 w-12"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
							<h3 class="mb-2 text-lg font-medium">No photos added yet</h3>
							<p class="text-sm">Start by adding your first photo URL above</p>
						</div>
					{/if}

					<!-- Hidden input for form submission -->
					<input type="hidden" name="photosUrls" bind:value={formData.photosUrls} />
					{#if form?.errors?.photosUrls}
						<p class="text-sm text-red-600">{form.errors.photosUrls[0]}</p>
					{/if}
				</CardContent>
			</Card>

			<!-- Price and Description -->
			<Card>
				<CardHeader>
					<CardTitle>Pricing and Description</CardTitle>
					<CardDescription>Set the price and generate property description using AI</CardDescription
					>
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

			<!-- Form Actions -->
			<div class="flex justify-end space-x-4">
				<Button type="button" variant="outline" onclick={() => history.back()}>Cancel</Button>
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

<form class="hidden" method="POST" action="?/generate-ai-price" use:analyzePriceForm.enhance>
	<input type="hidden" name="name" value={formData.name} />
	<input type="hidden" name="type" value={formData.type} />
	<input type="hidden" name="category" value={formData.category} />
	<!-- <input type="hidden" name="agentId" value={formData.agentId} /> -->
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
	<input type="hidden" name="photosUrls" value={formData.photosUrls} />
	<button type="submit" class="hidden" bind:this={aiAppraisalButton}>Generate AI Description</button
	>
</form>

<form class="hidden" method="POST" action="?/generate-ai-description" use:createDescForm.enhance>
	<input type="hidden" name="name" value={formData.name} />
	<input type="hidden" name="type" value={formData.type} />
	<input type="hidden" name="category" value={formData.category} />
	<!-- <input type="hidden" name="agentId" value={formData.agentId} /> -->
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
	<input type="hidden" name="photosUrls" value={formData.photosUrls} />
	<button type="submit" class="hidden" bind:this={aiDescriptionButton}
		>Generate AI Description</button
	>
</form>

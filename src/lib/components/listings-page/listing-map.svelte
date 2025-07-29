<script lang="ts">
	import { onMount, onDestroy, mount } from 'svelte';
	import CarouselListingCard from './carousel-listing-card.svelte';

	// Props
	let { listings = [] } = $props<{ listings: any[] }>();

	// Map container reference
	let mapContainer: HTMLDivElement;
	let map: any = null;
	let markers: any[] = [];
	let activePopup: any = null;

	// Philippines bounds for filtering
	const PHILIPPINES_BOUNDS = {
		north: 21.0,
		south: 4.5,
		east: 127.0,
		west: 116.0
	};

	// Color coding for property types
	const TYPE_COLORS = {
		'rent': '#10b981',    // Green
		'sale': '#3b82f6',    // Blue
		'lease': '#f59e0b'    // Amber
	};

	// Function to check if coordinates are within Philippines
	function isInPhilippines(lat: number, lng: number): boolean {
		return (
			lat >= PHILIPPINES_BOUNDS.south &&
			lat <= PHILIPPINES_BOUNDS.north &&
			lng >= PHILIPPINES_BOUNDS.west &&
			lng <= PHILIPPINES_BOUNDS.east
		);
	}

	// Function to extract and validate coordinates
	function getValidCoordinates(listing: any): { lat: number; lng: number } | null {
		try {
			const location = listing.property?.location;
			if (!location) return null;

			let lat: number, lng: number;

			// Handle if location is already parsed JSON or string
			if (typeof location === 'string') {
				const parsed = JSON.parse(location);
				lat = parseFloat(parsed.latitude || parsed.lat);
				lng = parseFloat(parsed.longitude || parsed.lng);
			} else {
				lat = parseFloat(location.latitude || location.lat);
				lng = parseFloat(location.longitude || location.lng);
			}

			// Validate coordinates
			if (isNaN(lat) || isNaN(lng)) return null;
			if (!isInPhilippines(lat, lng)) return null;

			return { lat, lng };
		} catch (error) {
			console.warn('Invalid location data for listing:', listing.id, error);
			return null;
		}
	}

	// Function to create custom circle marker with click events
	function createCircleMarker(lat: number, lng: number, type: string, listing: any): any {
		const color = TYPE_COLORS[type] || '#6b7280'; // Default gray for unknown types

		const marker = window.L.circleMarker([lat, lng], {
			radius: 8,
			fillColor: color,
			color: '#ffffff',
			weight: 2,
			opacity: 1,
			fillOpacity: 0.8
		});

		// Add click event to show popup
		marker.on('click', (e: any) => {
			// Close any existing popup
			if (activePopup) {
				map.closePopup(activePopup);
			}

			// Create popup content container
			const popupContent = document.createElement('div');
			popupContent.className = 'listing-popup-container';
			popupContent.style.width = '320px';

			// Mount Svelte component to the popup content using Svelte 5 syntax
			try {
				mount(CarouselListingCard, {
					target: popupContent,
					props: listing
				});
			} catch (error) {
				console.error('Error creating listing card:', error);
				popupContent.innerHTML = '<div class="p-4">Error loading listing details</div>';
			}

			// Create and configure popup
			const popup = window.L.popup({
				maxWidth: 350,
				minWidth: 320,
				autoPan: true,
				closeButton: true,
				autoClose: false,
				closeOnEscapeKey: true,
				className: 'custom-listing-popup'
			}).setContent(popupContent);

			// Bind and open popup
			marker.bindPopup(popup).openPopup();
			activePopup = popup;

			// Prevent event from bubbling to map
			e.originalEvent.stopPropagation();
		});

		return marker;
	}

	// Clear all markers from map
	function clearMarkers() {
		markers.forEach(marker => {
			if (map && marker) {
				map.removeLayer(marker);
			}
		});
		markers = [];

		// Clear active popup
		if (activePopup) {
			map.closePopup(activePopup);
			activePopup = null;
		}
	}

	// Update markers based on filtered listings
	function updateMarkers() {
		if (!map || !window.L) return;

		clearMarkers();

		// Filter listings with valid Philippines coordinates
		const validListings = listings
			.map(listing => ({
				...listing,
				coordinates: getValidCoordinates(listing)
			}))
			.filter(listing => listing.coordinates !== null);

		// Add markers for each valid listing
		validListings.forEach(listing => {
			const { lat, lng } = listing.coordinates!;
			const propertyType = listing.property?.type || 'unknown';

			try {
				const marker = createCircleMarker(lat, lng, propertyType, listing);
				marker.addTo(map);
				markers.push(marker);
			} catch (error) {
				console.warn('Failed to create marker for listing:', listing.id, error);
			}
		});

		// Fit map to show all markers if any exist
		if (markers.length > 0) {
			const group = new window.L.featureGroup(markers);
			map.fitBounds(group.getBounds().pad(0.1));
		}
	}

	// Initialize map
	function initializeMap() {
		if (!mapContainer || !window.L) return;

		try {
			// Create map centered on Philippines
			map = window.L.map(mapContainer, {
				center: [12.8797, 121.7740], // Center of Philippines
				zoom: 6,
				zoomControl: true,
				scrollWheelZoom: true,
				doubleClickZoom: true,
				dragging: true
			});

			// Add OpenStreetMap tile layer
			window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
				maxZoom: 18
			}).addTo(map);

			// Close popup when clicking on map
			map.on('click', () => {
				if (activePopup) {
					map.closePopup(activePopup);
					activePopup = null;
				}
			});

			// Update markers after map is ready
			updateMarkers();
		} catch (error) {
			console.error('Failed to initialize map:', error);
		}
	}

	// Load Leaflet CSS and JS
	function loadLeaflet(): Promise<void> {
		return new Promise((resolve, reject) => {
			// Check if already loaded
			if (window.L) {
				resolve();
				return;
			}

			// Load CSS
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);

			// Load JS
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load Leaflet'));
			document.head.appendChild(script);
		});
	}

	// Component lifecycle
	onMount(async () => {
		try {
			await loadLeaflet();
			initializeMap();
		} catch (error) {
			console.error('Failed to load map:', error);
		}
	});

	onDestroy(() => {
		if (map) {
			clearMarkers();
			map.remove();
			map = null;
		}
	});

	// React to listings changes
	$effect(() => {
		if (map && listings) {
			updateMarkers();
		}
	});
</script>

<!-- Map container with proper z-index -->
<div
	bind:this={mapContainer}
	class="w-full h-full bg-muted rounded-lg border relative"
	style="z-index: 1;"
>
	<!-- Loading state -->
	{#if !map}
		<div class="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
			<div class="text-center text-muted-foreground">
				<div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
				<p class="text-sm">Loading map...</p>
			</div>
		</div>
	{/if}
</div>

<!-- Legend for marker colors -->
{#if map}
	<div class="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg z-10">
		<h4 class="text-sm font-medium mb-2">Property Types</h4>
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full border-2 border-white" style="background-color: #3b82f6;"></div>
				<span class="text-xs">For Sale</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full border-2 border-white" style="background-color: #10b981;"></div>
				<span class="text-xs">For Rent</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full border-2 border-white" style="background-color: #f59e0b;"></div>
				<span class="text-xs">For Lease</span>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Ensure Leaflet controls don't interfere with page layout */
	:global(.leaflet-container) {
		font-family: inherit;
	}

	:global(.leaflet-control-container) {
		font-family: inherit;
	}

	/* Custom popup styling */
	:global(.custom-listing-popup .leaflet-popup-content-wrapper) {
		padding: 0;
		border-radius: 12px;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border: 1px solid hsl(var(--border));
	}

	:global(.custom-listing-popup .leaflet-popup-content) {
		margin: 0;
		border-radius: 12px;
		overflow: hidden;
		width: 320px !important;
	}

	:global(.custom-listing-popup .leaflet-popup-tip) {
		background: hsl(var(--background));
		border: 1px solid hsl(var(--border));
	}

	:global(.listing-popup-container) {
		border-radius: 12px;
		overflow: hidden;
	}
</style>

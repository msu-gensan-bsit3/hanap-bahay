<script lang="ts">
	import { Home } from "@lucide/svelte";

	interface PhotoUrl {
		url: string;
	}

	interface Props {
		photos: PhotoUrl[];
		propertyName: string;
		class?: string;
	}

	let { photos, propertyName, class: className = "" }: Props = $props();

	// Image gallery state
	let selectedImageIndex = $state(0);

	// Navigate between images
	function navigateImage(direction: "prev" | "next") {
		if (!photos?.length) return;

		if (direction === "prev") {
			selectedImageIndex = selectedImageIndex === 0 ? photos.length - 1 : selectedImageIndex - 1;
		} else {
			selectedImageIndex = selectedImageIndex === photos.length - 1 ? 0 : selectedImageIndex + 1;
		}
	}
</script>

<div class="space-y-4 {className}">
	{#if photos && photos.length > 0}
		{@const mainPhoto = photos[selectedImageIndex] || photos[0]}

		<!-- Main Image -->
		<div class="relative aspect-video overflow-hidden rounded-lg shadow-lg">
			<img
				src={mainPhoto.url}
				alt={propertyName}
				class="main-image h-full w-full object-cover"
			/>

			<!-- Navigation buttons for main image -->
			{#if photos.length > 1}
				<button
					class="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
					onclick={() => navigateImage("prev")}
					aria-label="Previous image"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
				</button>
				<button
					class="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
					onclick={() => navigateImage("next")}
					aria-label="Next image"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
			{/if}

			<!-- Heart and share buttons -->
			<div class="absolute top-4 right-4 flex gap-2">
				<button
					class="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm transition-colors hover:bg-white"
					aria-label="Add to favorites"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						></path>
					</svg>
				</button>
				<button
					class="rounded-full bg-white/90 p-2 text-gray-700 shadow-sm transition-colors hover:bg-white"
					aria-label="Share property"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
						></path>
					</svg>
				</button>
			</div>
		</div>

		<!-- Thumbnail Gallery -->
		{#if photos.length > 1}
			<div class="thumbnail-gallery flex gap-2 overflow-x-auto pb-2">
				{#each photos as photo, index}
					<button
						class="thumbnail-button flex-shrink-0 {selectedImageIndex === index
							? 'ring-2 ring-blue-500'
							: ''}"
						onclick={() => (selectedImageIndex = index)}
						aria-label="View image {index + 1}"
					>
						<div class="aspect-video h-20 w-28 overflow-hidden rounded-lg">
							<img
								src={photo.url}
								alt={`${propertyName} - Image ${index + 1}`}
								class="h-full w-full object-cover transition-opacity {selectedImageIndex === index
									? 'opacity-100'
									: 'opacity-70 hover:opacity-100'}"
							/>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	{:else}
		<!-- Placeholder image if no photos -->
		<div class="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-200">
			<div class="text-center text-gray-500">
				<Home class="mx-auto mb-2 h-16 w-16" />
				<p>No images available</p>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Main image hover effects */
	:global(.main-image) {
		transition: transform 0.3s ease-in-out;
	}

	:global(.main-image:hover) {
		transform: scale(1.02);
	}

	/* Thumbnail styling */
	:global(.thumbnail-button) {
		transition: all 0.2s ease-in-out;
		border-radius: 0.5rem;
	}

	:global(.thumbnail-button:hover) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	/* Custom scrollbar for thumbnail gallery */
	:global(.thumbnail-gallery) {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 #f1f5f9;
	}

	:global(.thumbnail-gallery::-webkit-scrollbar) {
		height: 6px;
	}

	:global(.thumbnail-gallery::-webkit-scrollbar-track) {
		background: #f1f5f9;
		border-radius: 3px;
	}

	:global(.thumbnail-gallery::-webkit-scrollbar-thumb) {
		background: #cbd5e1;
		border-radius: 3px;
	}

	:global(.thumbnail-gallery::-webkit-scrollbar-thumb:hover) {
		background: #94a3b8;
	}
</style>

<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
</script>

<Card.Root class="relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm">
	<!-- Header with Profile Image and Basic Info -->
	<div class="relative bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
		<div class="flex items-start gap-4">
			<!-- Profile Image Skeleton -->
			<div
				class="h-16 w-16 flex-shrink-0 animate-pulse rounded-full bg-gray-300 shadow-md ring-4 ring-white"
			></div>

			<!-- Name and Credentials Skeleton -->
			<div class="min-w-0 flex-1 space-y-2">
				<div class="h-5 w-32 animate-pulse rounded bg-gray-300"></div>
				<div class="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
				<div class="mt-2 flex items-center gap-1">
					<div class="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
					<div class="h-4 w-12 animate-pulse rounded bg-gray-300"></div>
					<div class="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Content Skeleton -->
	<Card.Content class="flex-1 p-6">
		<!-- Location Skeleton -->
		<div class="mb-4 flex items-start gap-2">
			<div class="mt-0.5 h-4 w-4 flex-shrink-0 animate-pulse rounded bg-gray-300"></div>
			<div class="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
		</div>

		<!-- About Skeleton -->
		<div class="mb-4">
			<div class="min-h-[3rem] space-y-2">
				<div class="h-4 w-full animate-pulse rounded bg-gray-300"></div>
				<div class="h-4 w-full animate-pulse rounded bg-gray-300"></div>
			</div>
		</div>

		<!-- Stats Skeleton -->
		<div class="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
			<div class="space-y-1 text-center">
				<div class="mx-auto h-6 w-8 animate-pulse rounded bg-gray-300"></div>
				<div class="mx-auto h-3 w-16 animate-pulse rounded bg-gray-300"></div>
			</div>
			<div class="space-y-1 text-center">
				<div class="mx-auto h-6 w-8 animate-pulse rounded bg-gray-300"></div>
				<div class="mx-auto h-3 w-20 animate-pulse rounded bg-gray-300"></div>
			</div>
		</div>

		<!-- Experience Skeleton -->
		<div class="mb-4 flex items-center justify-between">
			<div class="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
			<div class="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
		</div>

		<!-- Contact Info Skeleton -->
		<div class="space-y-2 border-t pt-4">
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
				<div class="h-4 w-32 animate-pulse rounded bg-gray-300"></div>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
				<div class="h-4 w-40 animate-pulse rounded bg-gray-300"></div>
			</div>
		</div>
	</Card.Content>

	<!-- Footer Skeleton -->
	<div class="border-t bg-gray-50 p-4">
		<div class="h-8 w-full animate-pulse rounded bg-gray-300"></div>
	</div>
</Card.Root>

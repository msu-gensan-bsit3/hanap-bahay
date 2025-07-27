<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<Card.Root class="relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm">
	<!-- Image with badge overlay -->
	<div class="relative h-64 overflow-hidden bg-muted">
		<!-- Badge skeleton -->
		<div class="absolute top-3 left-3 z-10">
			<Skeleton class="h-6 w-20 rounded-full" />
		</div>
		<!-- Heart button skeleton -->
		<div class="absolute top-3 right-3 z-10">
			<Skeleton class="h-8 w-8 rounded-full" />
		</div>
		<!-- Image skeleton -->
		<Skeleton class="h-full w-full" />
	</div>

	<!-- Content -->
	<Card.Content class="flex flex-1 flex-col justify-between p-4">
		<div class="space-y-2">
			<!-- Price -->
			<Skeleton class="h-7 w-32" />

			<!-- Property details -->
			<Skeleton class="h-4 w-24" />

			<!-- Address -->
			<div class="flex items-start gap-1">
				<Skeleton class="mt-0.5 h-3 w-3 rounded-sm" />
				<Skeleton class="h-4 w-48" />
			</div>

			<!-- Property name -->
			<Skeleton class="h-4 w-full" />

			<div class="flex justify-between gap-4">
				<!-- Features -->
				<div class="flex gap-1">
					<Skeleton class="h-5 w-16 rounded-full" />
					<Skeleton class="h-5 w-20 rounded-full" />
					<Skeleton class="h-5 w-14 rounded-full" />
				</div>

				<!-- Category -->
				<Skeleton class="h-5 w-24 rounded-full" />
			</div>
		</div>

		<!-- Agent info -->
		<div class="mt-3 border-t pt-3">
			<div class="flex items-center gap-3">
				<Skeleton class="h-8 w-8 rounded-full" />
				<div class="min-w-0 flex-1 space-y-1">
					<Skeleton class="h-4 w-24" />
					<Skeleton class="h-3 w-20" />
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>

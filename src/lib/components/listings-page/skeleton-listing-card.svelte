<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div class="min-w-fit h-64 border-1 shadow-sm rounded-lg overflow-hidden flex">
	<div class="h-full flex-4">
		<Skeleton class="h-full w-full" />
	</div>
	<div class="w-full h-full flex flex-5 flex-col justify-between p-3">
		<div class="w-full inline-flex justify-between">
			<Skeleton class="h-8 w-40" />
			<Skeleton class="h-6 w-6 rounded-full" />
		</div>

		<div class="space-y-2">
			<div>
				<div class="h-5 flex items-center space-x-2 text-sm tracking-tight">
					<Skeleton class="h-5 w-48" />
				</div>
				<Skeleton class="h-4 w-52" />
			</div>
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-[80%]" />
			<div class="flex gap-1">
				<Skeleton class="h-4 w-32" />
			</div>
			<div class="flex gap-1">
				<Skeleton class="h-5 w-24" />
			</div>
		</div>

		<div class="w-full inline-flex items-center justify-between">
			<Skeleton class="h-4 w-32" />
			<Skeleton class="h-6 w-6 rounded-full" />
		</div>
	</div>
</div>
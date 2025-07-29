<div class="w-full h-full bg-muted rounded-lg border relative animate-pulse">
	<!-- Map background skeleton -->
	<div class="absolute inset-0 bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/5 rounded-lg"></div>

	<!-- Skeleton map controls -->
	<div class="absolute top-4 left-4 space-y-2">
		<div class="w-8 h-8 bg-background/80 rounded border shadow-sm"></div>
		<div class="w-8 h-8 bg-background/80 rounded border shadow-sm"></div>
	</div>

	<!-- Skeleton legend -->
	<div class="absolute top-4 right-4 bg-background/80 border rounded-lg p-3 shadow-lg">
		<div class="h-4 w-20 bg-muted-foreground/20 rounded mb-2"></div>
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full bg-blue-400/50"></div>
				<div class="h-3 w-12 bg-muted-foreground/20 rounded"></div>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full bg-green-400/50"></div>
				<div class="h-3 w-12 bg-muted-foreground/20 rounded"></div>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 rounded-full bg-amber-400/50"></div>
				<div class="h-3 w-12 bg-muted-foreground/20 rounded"></div>
			</div>
		</div>
	</div>

	<!-- Skeleton markers scattered across map -->
	<div class="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/60 rounded-full"></div>
	<div class="absolute top-1/3 right-1/4 w-2 h-2 bg-green-400/60 rounded-full"></div>
	<div class="absolute bottom-1/3 left-1/4 w-2 h-2 bg-amber-400/60 rounded-full"></div>
	<div class="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/60 rounded-full"></div>
	<div class="absolute bottom-1/4 right-2/3 w-2 h-2 bg-green-400/60 rounded-full"></div>
	<div class="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400/60 rounded-full"></div>

	<!-- Loading text -->
	<div class="absolute inset-0 flex items-center justify-center">
		<div class="text-center text-muted-foreground">
			<div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
			<p class="text-sm">Loading map...</p>
		</div>
	</div>
</div>


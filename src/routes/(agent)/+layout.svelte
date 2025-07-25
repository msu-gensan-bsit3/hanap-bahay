<script>
	import { Sidebar } from "$lib/components/dashboard";
	
	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Mobile Header (visible on small screens) -->
	<div class="border-b bg-white p-4 shadow-sm lg:hidden">
		<div class="flex items-center justify-between">
			<div class="flex items-center">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white"
				>
					J
				</div>
				<span class="ml-2 text-xl font-semibold">JuanHome</span>
			</div>
			<div class="text-sm text-gray-600">Marco Santos</div>
		</div>
	</div>

	<!-- Sidebar -->
	<div class="flex w-full">
		<div class="hidden lg:block">
			<Sidebar />
		</div>

		<div class="w-0 lg:w-64"></div>

		<!-- Main Content -->
		<div class="@container flex-1 p-4 lg:p-8">
			{@render children()}
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

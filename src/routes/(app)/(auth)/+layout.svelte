<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
	{@render children()}
</div>

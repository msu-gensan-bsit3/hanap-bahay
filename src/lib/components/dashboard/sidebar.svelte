<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	interface NavigationItem {
		label: string;
		href: string;
		icon: string;
		badge?: number;
		active?: boolean;
		fillRule?: boolean;
	}

	const navigationItems: NavigationItem[] = [
		{
			label: 'Dashboard',
			href: '/agent/dashboard',
			icon: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z',
			active: true
		},
		{
			label: 'Listings',
			href: '/agent/listings',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			label: 'Messages',
			href: '/agent/messages',
			icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
			badge: 12
		},
		{
			label: 'Leads',
			href: '/agent/leads',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			label: 'Analytics',
			href: '/agent/analytics',
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
		},
		{
			label: 'Commission',
			href: '/agent/commission',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			label: 'Settings',
			href: '/agent/settings',
			icon: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z',
			fillRule: true
		}
	];

	const agentInfo = {
		name: 'Marco Santos',
		license: 'PRC Lic #12345',
		avatar: '/no-profile.jpg',
		status: 'Available'
	};
</script>

<div class="inset-y-0 h-screen fixed left-0 w-64 bg-white shadow-lg">
	<!-- Header -->
	<div class="flex items-center px-6 py-4 border-b">
		<div class="flex items-center">
			<div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
				J
			</div>
			<span class="ml-2 text-xl font-semibold">JuanHome</span>
		</div>
	</div>
	
	<!-- Navigation -->
	<nav class="mt-8">
		{#each navigationItems as item}
			<div class="px-6 py-2">
				<a 
					href={item.href} 
					class="flex items-center px-4 py-2 rounded-lg {item.active 
						? 'text-blue-600 bg-blue-50' 
						: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
				>
					<svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
						{#if item.fillRule}
							<path fill-rule="evenodd" d={item.icon} clip-rule="evenodd"/>
						{:else}
							<path d={item.icon}/>
						{/if}
					</svg>
					{item.label}
					{#if item.badge}
						<Badge class="ml-auto bg-red-500">{item.badge}</Badge>
					{/if}
				</a>
			</div>
		{/each}
	</nav>
	
	<!-- Agent Profile -->
	<div class="absolute bottom-0 w-full p-6 border-t">
		<div class="flex items-center">
			<img class="w-10 h-10 rounded-full" src={agentInfo.avatar} alt={agentInfo.name}>
			<div class="ml-3">
				<p class="text-sm font-medium text-gray-900">{agentInfo.name}</p>
				<p class="text-xs text-gray-500">{agentInfo.license}</p>
			</div>
		</div>
		<div class="mt-2 flex items-center">
			<div class="flex items-center">
				<div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
				<span class="text-xs text-gray-500">{agentInfo.status}</span>
			</div>
		</div>
	</div>
</div>
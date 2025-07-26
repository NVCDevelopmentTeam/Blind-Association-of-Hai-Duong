<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import AdminDashboard from '$lib/components/admin/AdminDashboard.svelte';
	import NewsManager from '$lib/components/admin/NewsManager.svelte';
	import UserManager from '$lib/components/admin/UserManager.svelte';
	import SettingsManager from '$lib/components/admin/SettingsManager.svelte';
	import MediaManager from '$lib/components/admin/MediaManager.svelte';

	let currentUser = $state(null);
	let activeSection = $state('dashboard');
	let sidebarOpen = $state(true);

	onMount(() => {
		// Check authentication
		const unsubscribe = authStore.subscribe(auth => {
			if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
				goto('/admin/login', { replaceState: true });
				return;
			}
			currentUser = auth.user;
		});

		return unsubscribe;
	});

	function setActiveSection(section) {
		activeSection = section;
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head>
	<title>Quản trị hệ thống - TTPHCN Hải Dương</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if currentUser}
	<div class="min-h-screen bg-gray-100 dark:bg-gray-900">
		<AdminHeader {currentUser} {toggleSidebar} />
		
		<div class="flex">
			<AdminSidebar 
				{activeSection} 
				{setActiveSection} 
				{sidebarOpen}
			/>
			
			<main class="flex-1 p-6 {sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300">
				{#if activeSection === 'dashboard'}
					<AdminDashboard />
				{:else if activeSection === 'news'}
					<NewsManager />
				{:else if activeSection === 'users'}
					<UserManager />
				{:else if activeSection === 'media'}
					<MediaManager />
				{:else if activeSection === 'settings'}
					<SettingsManager />
				{/if}
			</main>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
	</div>
{/if}

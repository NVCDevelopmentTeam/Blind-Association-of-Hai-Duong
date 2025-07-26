<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	
	let { children } = $props();
	let sidebarOpen = $state(true);
	let currentUser = $state(null);
	
	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('admin_token');
			const userStr = localStorage.getItem('admin_user');
			
			if (!token || !userStr) {
				goto('/admin/login');
				return;
			}
			
			try {
				// Verify token with server
				const response = await fetch('http://localhost:3001/api/auth/verify', {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				
				if (response.ok) {
					const userData = await response.json();
					currentUser = userData.user;
				} else {
					localStorage.removeItem('admin_token');
					localStorage.removeItem('admin_user');
					goto('/admin/login');
				}
			} catch (error) {
				console.error('Auth verification error:', error);
				localStorage.removeItem('admin_token');
				localStorage.removeItem('admin_user');
				goto('/admin/login');
			}
		}
	});
	
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
	
	function handleLogout() {
		goto('/admin/logout');
	}
</script>

{#if currentUser}
	<div class="min-h-screen bg-gray-100 dark:bg-gray-900">
		<AdminHeader {currentUser} {toggleSidebar} {handleLogout} />
		
		<div class="flex">
			<AdminSidebar {sidebarOpen} />
			
			<main class="flex-1 {sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 p-6">
				{@render children()}
			</main>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
	</div>
{/if}

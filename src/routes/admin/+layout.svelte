<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import '../../app.css';

	let { children } = $props();
	let isAuthenticated = $state(false);
	let user = $state(null);
	let loading = $state(true);

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('admin_token');

			if (!token) {
				if ($page.url.pathname !== '/admin/login') {
					goto('/admin/login');
				}
				loading = false;
				return;
			}

			try {
				// Verify token with server
				const response = await fetch('/api/auth/verify', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				if (response.ok) {
					const userData = await response.json();
					user = userData;
					isAuthenticated = true;

					// Redirect to dashboard if on login page
					if ($page.url.pathname === '/admin/login') {
						goto('/admin/dashboard');
					}
				} else {
					localStorage.removeItem('admin_token');
					if ($page.url.pathname !== '/admin/login') {
						goto('/admin/login');
					}
				}
			} catch (error) {
				console.error('Auth verification error:', error);
				localStorage.removeItem('admin_token');
				if ($page.url.pathname !== '/admin/login') {
					goto('/admin/login');
				}
			}
		}

		loading = false;
	});

	// Redirect /admin to /admin/login
	$effect(() => {
		if (browser && $page.url.pathname === '/admin') {
			goto('/admin/login', { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Quản trị hệ thống - Trung tâm Phục hồi chức năng Hải Dương</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if loading}
	<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
			<p class="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
		</div>
	</div>
{:else}
	{@render children()}
{/if}

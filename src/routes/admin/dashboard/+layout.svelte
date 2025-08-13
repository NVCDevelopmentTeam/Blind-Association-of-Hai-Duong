<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let user = $state(null);
	let sidebarOpen = $state(false);

	onMount(() => {
		if (browser) {
			const token = localStorage.getItem('admin_token');
			const userData = localStorage.getItem('admin_user');

			if (!token || !userData) {
				goto('/admin/login');
				return;
			}

			try {
				user = JSON.parse(userData);
			} catch (e) {
				console.error('Error parsing user data:', e);
				goto('/admin/login');
			}
		}
	});

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if user}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Admin Header -->
		<AdminHeader {user} {toggleSidebar} />

		<div class="flex">
			<!-- Admin Sidebar -->
			<AdminSidebar bind:open={sidebarOpen} />

			<!-- Main Content -->
			<main class="flex-1 p-6 lg:ml-64 transition-all duration-300">
				{@render children?.()}
			</main>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<div
				class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
			></div>
			<p class="text-gray-600">Đang tải...</p>
		</div>
	</div>
{/if}

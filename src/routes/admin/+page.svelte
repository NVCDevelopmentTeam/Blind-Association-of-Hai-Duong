<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			// Redirect to login page with 301 status
			goto('/admin/login', { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Quản trị hệ thống - TTPHCN Hải Dương</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta http-equiv="refresh" content="0; url=/admin/login" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
	<div class="text-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
		<p class="text-gray-600 dark:text-gray-400">Đang chuyển hướng đến trang đăng nhập...</p>
	</div>
</div>

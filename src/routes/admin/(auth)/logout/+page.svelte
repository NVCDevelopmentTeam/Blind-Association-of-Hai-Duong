<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  onMount(() => {
    if (browser) {
      // Clear authentication data
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('remember_admin');
      
      // Redirect to login page with 302 status
      setTimeout(() => {
        goto('/admin/login', { replaceState: false });
      }, 2000);
    }
  });
</script>

<svelte:head>
  <title>Đăng xuất - Quản trị hệ thống</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <div class="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
      <i class="fas fa-check text-white text-2xl" aria-hidden="true"></i>
    </div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Đăng xuất thành công
    </h1>
    <p class="text-gray-600 dark:text-gray-400 mb-4">
      Cảm ơn bạn đã sử dụng hệ thống quản trị
    </p>
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Đang chuyển hướng về trang đăng nhập...
    </p>
  </div>
</div>

<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let { data, children } = $props();
  
  let sidebarOpen = $state(false);
  let user = data.user;
  
  const menuItems = [
    {
      title: 'Tổng quan',
      href: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt',
      active: page.url.pathname === '/admin/dashboard'
    },
    {
      title: 'Bài viết',
      icon: 'fas fa-file-alt',
      children: [
        { title: 'Tất cả bài viết', href: '/admin/posts', icon: 'fas fa-list' },
        { title: 'Thêm bài viết', href: '/admin/posts/new', icon: 'fas fa-plus' },
        { title: 'Danh mục', href: '/admin/categories', icon: 'fas fa-folder' },
        { title: 'Thẻ', href: '/admin/tags', icon: 'fas fa-tags' }
      ]
    },
    {
      title: 'Trang',
      icon: 'fas fa-file',
      children: [
        { title: 'Tất cả trang', href: '/admin/pages', icon: 'fas fa-list' },
        { title: 'Thêm trang', href: '/admin/pages/new', icon: 'fas fa-plus' }
      ]
    },
    {
      title: 'Bình luận',
      href: '/admin/comments',
      icon: 'fas fa-comments',
      badge: '5'
    },
    {
      title: 'Thư viện',
      href: '/admin/media',
      icon: 'fas fa-images'
    },
    {
      title: 'Liên hệ',
      icon: 'fas fa-envelope',
      children: [
        { title: 'Form liên hệ', href: '/admin/contact-forms', icon: 'fas fa-wpforms' },
        { title: 'Tin nhắn', href: '/admin/messages', icon: 'fas fa-inbox' }
      ]
    },
    {
      title: 'Người dùng',
      href: '/admin/users',
      icon: 'fas fa-users'
    },
    {
      title: 'Chat trực tuyến',
      href: '/admin/chat',
      icon: 'fas fa-comment-dots',
      badge: '2'
    },
    {
      title: 'Thống kê',
      href: '/admin/analytics',
      icon: 'fas fa-chart-bar'
    },
    {
      title: 'Cài đặt',
      icon: 'fas fa-cog',
      children: [
        { title: 'Cài đặt chung', href: '/admin/settings/general', icon: 'fas fa-sliders-h' },
        { title: 'Giao diện', href: '/admin/settings/theme', icon: 'fas fa-palette' },
        { title: 'SEO', href: '/admin/settings/seo', icon: 'fas fa-search' },
        { title: 'Mạng xã hội', href: '/admin/settings/social', icon: 'fas fa-share-alt' }
      ]
    }
  ];
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  function logout() {
    goto('/admin/logout');
  }
  
  onMount(() => {
    // Close sidebar on mobile when clicking outside
    function handleClickOutside(event) {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        sidebarOpen = false;
      }
    }
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Sidebar -->
  <div class="sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0">
    <div class="flex items-center justify-center h-16 bg-blue-600">
      <h1 class="text-white text-xl font-bold">Admin Panel</h1>
    </div>
    
    <nav class="mt-8 px-4 space-y-2">
      {#each menuItems as item}
        {#if item.children}
          <div class="space-y-1">
            <button class="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" aria-label={item.title}>
              <div class="flex items-center">
                <i class="{item.icon} w-5 h-5 mr-3"></i>
                <span>{item.title}</span>
              </div>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
            <div class="ml-8 space-y-1">
              {#each item.children as child}
                <a 
                  href={child.href}
                  class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  class:bg-blue-50={page.url.pathname === child.href}
                  class:text-blue-600={page.url.pathname === child.href}
                >
                  <i class="{child.icon} w-4 h-4 mr-3"></i>
                  <span>{child.title}</span>
                </a>
              {/each}
            </div>
          </div>
        {:else}
          <a 
            href={item.href}
            class="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            class:bg-blue-50={page.url.pathname === item.href}
            class:text-blue-600={page.url.pathname === item.href}
            aria-label={item.title}
          >
            <div class="flex items-center">
              <i class="{item.icon} w-5 h-5 mr-3"></i>
              <span>{item.title}</span>
            </div>
            {#if item.badge}
              <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>
            {/if}
          </a>
        {/if}
      {/each}
    </nav>
    
    <!-- User info at bottom -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">{user?.name?.charAt(0) || 'A'}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
          <p class="text-xs text-gray-500 truncate">{user?.email || ''}</p>
        </div>
        <button 
          onclick={logout}
          class="text-gray-400 hover:text-gray-600"
          title="Đăng xuất"
          aria-label="Đăng xuất"
        >
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Main content -->
  <div class="lg:ml-64">
    <!-- Top bar -->
    <header class="bg-white shadow-sm border-b">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center">
          <button 
            class="sidebar-toggle lg:hidden text-gray-500 hover:text-gray-700 mr-4"
            onclick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>
          <h2 class="text-xl font-semibold text-gray-800">
            {#if page.url.pathname === '/admin/dashboard'}
              Tổng quan
            {:else if page.url.pathname.includes('/posts')}
              Quản lý bài viết
            {:else if page.url.pathname.includes('/pages')}
              Quản lý trang
            {:else if page.url.pathname.includes('/comments')}
              Quản lý bình luận
            {:else if page.url.pathname.includes('/users')}
              Quản lý người dùng
            {:else if page.url.pathname.includes('/settings')}
              Cài đặt
            {:else}
              Quản trị
            {/if}
          </h2>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="relative text-gray-500 hover:text-gray-700" aria-label="Notifications">
            <i class="fas fa-bell text-xl"></i>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
          
          <!-- Quick actions -->
          <a href="/admin/posts/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" aria-label="Thêm bài viết mới">
            <i class="fas fa-plus mr-2"></i>
            Bài viết mới
          </a>
          
          <!-- View site -->
          <a href="/" target="_blank" class="text-gray-500 hover:text-gray-700" title="Xem trang web" aria-label="Xem trang web">
            <i class="fas fa-external-link-alt text-xl"></i>
          </a>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="p-6">
      {@render children?.()}
    </main>
  </div>
</div>

<!-- Mobile sidebar overlay -->
{#if sidebarOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" role="button" tabindex="0" onclick={toggleSidebar} onkeydown={(e) => e.key === 'Enter' && toggleSidebar()}></div>
{/if}

<style>
  :global(body) {
    font-family: 'Inter', sans-serif;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { props } from 'svelte/store';
  
  let { data } = props();
  
  let stats = $state({
    totalPosts: 0,
    totalUsers: 0,
    todayVisitors: 0,
    totalVisitors: 0,
    activeChatSessions: 0,
    onlineUsers: 0
  });
  
  let recentPosts = $state([]);
  let recentComments = [];
  let loading = $state(true);
  
  onMount(async () => {
    try {
      // Fetch dashboard statistics
      const response = await fetch('/api/admin/statistics', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      if (response.ok) {
        stats = await response.json();
      }
      
      // Fetch recent posts
      const postsResponse = await fetch('/api/admin/posts?limit=5', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        recentPosts = postsData.posts;
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      loading = false;
    }
  });
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Tổng quan - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
  <!-- Welcome message -->
  <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
    <h1 class="text-2xl font-bold mb-2">Chào mừng trở lại, {data.user.name}!</h1>
    <p class="text-blue-100">Đây là tổng quan về hoạt động của website hôm nay.</p>
  </div>

  <!-- Statistics cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-600">
          <i class="fas fa-file-alt text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Tổng bài viết</p>
          <p class="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalPosts}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-green-100 text-green-600">
          <i class="fas fa-users text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Người dùng</p>
          <p class="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalUsers}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
          <i class="fas fa-eye text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Lượt xem hôm nay</p>
          <p class="text-2xl font-bold text-gray-900">{loading ? '...' : stats.todayVisitors}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-purple-100 text-purple-600">
          <i class="fas fa-chart-line text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Tổng lượt xem</p>
          <p class="text-2xl font-bold text-gray-900">{loading ? '...' : stats.totalVisitors}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-red-100 text-red-600">
          <i class="fas fa-comment-dots text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Chat đang hoạt động</p>
          <p class="text-2xl font-bold text-gray-900">{loading ? '...' : stats.activeChatSessions}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-indigo-100 text-indigo-600">
          <i class="fas fa-globe text-xl"></i>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Đang online</p>
          <p class="text-2xl font-bold text-gray-900">{loading ? '...' : stats.onlineUsers}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent activity -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Recent posts -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Bài viết gần đây</h3>
          <a href="/admin/posts" class="text-blue-600 hover:text-blue-500 text-sm">Xem tất cả</a>
        </div>
      </div>
      <div class="p-6">
        {#if loading}
          <div class="space-y-4">
            {#each Array(3) as _}
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            {/each}
          </div>
        {:else if recentPosts.length > 0}
          <div class="space-y-4">
            {#each recentPosts as post}
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i class="fas fa-file-alt text-gray-500"></i>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    <a href="/admin/posts/{post.id}" class="hover:text-blue-600">
                      {post.title}
                    </a>
                  </p>
                  <p class="text-xs text-gray-500">
                    {formatDate(post.createdAt)} • {post.author?.name || 'Unknown'}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    {post.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
                  </span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 text-center py-8">Chưa có bài viết nào</p>
        {/if}
      </div>
    </div>

    <!-- Quick actions -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Thao tác nhanh</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 gap-4">
          <a href="/admin/posts/new" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <i class="fas fa-plus text-2xl text-gray-400 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Bài viết mới</span>
          </a>
          
          <a href="/admin/pages/new" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <i class="fas fa-file text-2xl text-gray-400 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Trang mới</span>
          </a>
          
          <a href="/admin/media" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <i class="fas fa-upload text-2xl text-gray-400 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Tải lên</span>
          </a>
          
          <a href="/admin/settings/general" class="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <i class="fas fa-cog text-2xl text-gray-400 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Cài đặt</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- System health -->
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Tình trạng hệ thống</h3>
    </div>
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Server</p>
            <p class="text-xs text-gray-500">Hoạt động bình thường</p>
          </div>
        </div>
        
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Cơ sở dữ liệu</p>
            <p class="text-xs text-gray-500">Kết nối ổn định</p>
          </div>
        </div>
        
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Bộ nhớ</p>
            <p class="text-xs text-gray-500">Sử dụng 68%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

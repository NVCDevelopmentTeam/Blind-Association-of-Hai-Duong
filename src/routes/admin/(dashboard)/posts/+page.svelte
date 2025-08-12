<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let { data } = $props();
  
  let posts = [];
  let loading = true;
  let currentPage = 1;
  let totalPages = 1;
  let searchQuery = '';
  let statusFilter = '';
  let categoryFilter = '';
  
  let categories = [];
  
  onMount(async () => {
    await loadCategories();
    await loadPosts();
  });
  
  async function loadCategories() {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        categories = await response.json();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  async function loadPosts() {
    loading = true;
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(searchQuery && { search: searchQuery })
      });
      
      const response = await fetch(`/api/admin/posts?${params}`);
      if (response.ok) {
        const result = await response.json();
        posts = result.posts;
        totalPages = result.pagination.pages;
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      loading = false;
    }
  }
  
  async function deletePost(postId) {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function getStatusBadge(status) {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getStatusText(status) {
    switch (status) {
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'DRAFT':
        return 'Nháp';
      case 'ARCHIVED':
        return 'Lưu trữ';
      default:
        return status;
    }
  }
</script>

<svelte:head>
  <title>Quản lý bài viết - Admin Panel</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
    <a href="/admin/posts/new" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
      <i class="fas fa-plus mr-2"></i>
      Thêm bài viết
    </a>
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
          Tìm kiếm
        </label>
        <input
          id="search"
          type="text"
          bind:value={searchQuery}
          placeholder="Tìm theo tiêu đề..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          id="status"
          bind:value={statusFilter}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả</option>
          <option value="PUBLISHED">Đã xuất bản</option>
          <option value="DRAFT">Nháp</option>
          <option value="ARCHIVED">Lưu trữ</option>
        </select>
      </div>
      
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
          Danh mục
        </label>
        <select
          id="category"
          bind:value={categoryFilter}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả</option>
          {#each categories as category}
            <option value={category.slug}>{category.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="flex items-end">
        <button
          aria-label="Lọc bài viết"
          onclick={loadPosts}
          class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Lọc
        </button>
      </div>
    </div>
  </div>

  <!-- Posts table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    {#if loading}
      <div class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-2xl text-gray-400 mb-4"></i>
        <p class="text-gray-500">Đang tải...</p>
      </div>
    {:else if posts.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bài viết
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lượt xem
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each posts as post}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-start space-x-3">
                    {#if post.featuredImage}
                      <img src={post.featuredImage || "/placeholder.svg"} alt="" class="w-12 h-12 object-cover rounded-md" />
                    {:else}
                      <div class="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <i class="fas fa-file-alt text-gray-400"></i>
                      </div>
                    {/if}
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        <a href="/admin/posts/{post.id}" class="hover:text-blue-600">
                          {post.title}
                        </a>
                      </p>
                      <p class="text-xs text-gray-500">
                        Bởi {post.author?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {#if post.category}
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style="background-color: {post.category.color}20; color: {post.category.color}">
                      {post.category.name}
                    </span>
                  {:else}
                    <span class="text-gray-400 text-sm">Chưa phân loại</span>
                  {/if}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusBadge(post.status)}">
                    {getStatusText(post.status)}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.views || 0}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <a href="/posts/{post.slug}" target="_blank" class="text-gray-400 hover:text-gray-600" aria-label="Xem bài viết">
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="/admin/posts/{post.id}" class="text-blue-600 hover:text-blue-900" aria-label="Chỉnh sửa">
                      <i class="fas fa-edit"></i>
                    </a>
                    <button onclick={() => deletePost(post.id)} class="text-red-600 hover:text-red-900" aria-label="Xóa">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                disabled={currentPage <= 1}
                onclick={() => { currentPage--; loadPosts(); }}
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                aria-label="Trang trước"
              >
                Trước
              </button>
              <button
                disabled={currentPage >= totalPages}
                onclick={() => { currentPage++; loadPosts(); }}
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                aria-label="Trang sau"
              >
                Sau
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Trang <span class="font-medium">{currentPage}</span> / <span class="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    disabled={currentPage <= 1}
                    onclick={() => { currentPage--; loadPosts(); }}
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Trang trước"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onclick={() => { currentPage++; loadPosts(); }}
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Trang sau"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {:else}
      <div class="p-8 text-center">
        <i class="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
        <p class="text-gray-500 mb-4">Bắt đầu bằng cách tạo bài viết đầu tiên của bạn.</p>
        <a href="/admin/posts/new" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Thêm bài viết mới
        </a>
      </div>
    {/if}
  </div>
</div>

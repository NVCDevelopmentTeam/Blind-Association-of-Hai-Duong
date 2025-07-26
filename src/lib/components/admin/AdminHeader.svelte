<script>
  let { currentUser, toggleSidebar, handleLogout } = $props();
  let showUserMenu = $state(false);
  let showNotifications = $state(false);
  
  const notifications = [
    {
      id: 1,
      title: 'Bình luận mới',
      message: 'Có bình luận mới cần duyệt',
      time: '5 phút trước',
      type: 'comment',
      unread: true
    },
    {
      id: 2,
      title: 'Bài viết được đăng',
      message: 'Bài viết "Đào tạo CNTT" đã được đăng thành công',
      time: '1 giờ trước',
      type: 'post',
      unread: false
    }
  ];
  
  function toggleUserMenu() {
    showUserMenu = !showUserMenu;
    showNotifications = false;
  }
  
  function toggleNotifications() {
    showNotifications = !showNotifications;
    showUserMenu = false;
  }
</script>

<header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
  <div class="flex items-center justify-between px-6 py-4">
    <div class="flex items-center gap-4">
      <button 
        onclick={toggleSidebar}
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
        aria-label="Toggle sidebar"
      >
        <i class="fas fa-bars text-gray-600 dark:text-gray-300"></i>
      </button>
      
      <h1 class="text-xl font-bold text-gray-800 dark:text-white">
        Quản trị hệ thống
      </h1>
    </div>
    
    <div class="flex items-center gap-4">
      <!-- Search -->
      <div class="relative hidden md:block">
        <input 
          type="search"
          placeholder="Tìm kiếm..."
          class="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400" aria-hidden="true"></i>
        </div>
      </div>

      <!-- Notifications -->
      <div class="relative">
        <button 
          onclick={toggleNotifications}
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
          aria-label="Thông báo"
        >
          <i class="fas fa-bell text-gray-600 dark:text-gray-300"></i>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        {#if showNotifications}
          <div class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Thông báo</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
              {#each notifications as notification}
                <div class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 {notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <i class="fas {notification.type === 'comment' ? 'fa-comment' : 'fa-newspaper'} text-blue-600 dark:text-blue-400 text-sm" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {#if notification.unread}
                      <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
            <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Xem tất cả thông báo
              </button>
            </div>
          </div>
        {/if}
      </div>
      
      <!-- User Menu -->
      <div class="relative">
        <button 
          onclick={toggleUserMenu}
          class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="User menu"
        >
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-white text-sm"></i>
          </div>
          <span class="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">{currentUser?.name}</span>
          <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
        </button>
        
        {#if showUserMenu}
          <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.name}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
            </div>
            <a href="/admin/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="fas fa-user mr-2"></i>
              Hồ sơ cá nhân
            </a>
            <a href="/admin/dashboard/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <i class="fas fa-cog mr-2"></i>
              Cài đặt
            </a>
            <hr class="my-2 border-gray-200 dark:border-gray-600">
            <button 
              onclick={handleLogout}
              class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>
              Đăng xuất
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>

<!-- Click outside to close dropdowns -->
{#if showUserMenu || showNotifications}
  <div 
    class="fixed inset-0 z-20" 
    onclick={() => { showUserMenu = false; showNotifications = false; }}
    aria-hidden="true"
  ></div>
{/if}

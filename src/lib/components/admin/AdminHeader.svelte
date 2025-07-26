<script>
	let { currentUser, toggleSidebar, handleLogout } = $props();
	let showUserMenu = $state(false);
	
	function toggleUserMenu() {
		showUserMenu = !showUserMenu;
	}
</script>

<header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
	<div class="flex items-center justify-between px-6 py-4">
		<div class="flex items-center gap-4">
			<button 
				onclick={toggleSidebar}
				class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
				aria-label="Toggle sidebar"
			>
				<i class="fas fa-bars text-gray-600 dark:text-gray-300"></i>
			</button>
			
			<h1 class="text-xl font-bold text-gray-800 dark:text-white">
				Quản trị hệ thống
			</h1>
		</div>
		
		<div class="flex items-center gap-4">
			<!-- Notifications -->
			<button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative" aria-label="Notifications">
				<i class="fas fa-bell text-gray-600 dark:text-gray-300"></i>
				<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
			</button>
			
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
					<span class="text-gray-700 dark:text-gray-300 font-medium">{currentUser.name}</span>
					<i class="fas fa-chevron-down text-gray-500 text-xs"></i>
				</button>
				
				{#if showUserMenu}
					<div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
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

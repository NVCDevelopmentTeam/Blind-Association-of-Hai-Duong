<script>
	import { goto } from '$app/navigation';
	
	let { user, toggleSidebar } = $props();
	let dropdownOpen = $state(false);
	
	function handleLogout() {
		goto('/admin/logout');
	}
	
	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
	
	function handleKeyDown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			toggleDropdown();
		}
	}
</script>

<header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
	<div class="px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Left side -->
			<div class="flex items-center">
				<button
					onclick={toggleSidebar}
					class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
					aria-label="Mở menu"
				>
					<i class="fas fa-bars text-xl"></i>
				</button>
				
				<div class="flex items-center ml-4 lg:ml-0">
					<div class="flex-shrink-0">
						<i class="fas fa-shield-alt text-blue-600 text-2xl"></i>
					</div>
					<div class="ml-3">
						<h1 class="text-lg font-semibold text-gray-900 dark:text-white">
							Quản trị viên
						</h1>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Trung tâm Phục hồi chức năng Hải Dương
						</p>
					</div>
				</div>
			</div>

			<!-- Right side -->
			<div class="flex items-center space-x-4">
				<!-- Notifications -->
				<button class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative" aria-label="Thông báo">
					<i class="fas fa-bell text-xl"></i>
					<span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
				</button>

				<!-- User dropdown -->
				<div class="relative">
					<button
						onclick={toggleDropdown}
						onkeydown={handleKeyDown}
						class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						aria-expanded={dropdownOpen}
						aria-haspopup="true"
						tabindex="0"
					>
						<div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
							<span class="text-white font-medium">
								{user?.name?.charAt(0) || 'A'}
							</span>
						</div>
						<span class="ml-3 text-gray-700 dark:text-gray-300 font-medium">
							{user?.name || 'Administrator'}
						</span>
						<i class="fas fa-chevron-down ml-2 text-gray-400"></i>
					</button>

					{#if dropdownOpen}
						<div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
							<div class="py-1">
								<div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
									<p class="font-medium">{user?.name || 'Administrator'}</p>
									<p class="text-gray-500 dark:text-gray-400">{user?.email}</p>
								</div>
								
								<a href="/admin/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Hồ sơ cá nhân">
									<i class="fas fa-user mr-2"></i>
									Hồ sơ cá nhân
								</a>
								
								<a href="/admin/dashboard/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Cài đặt">
									<i class="fas fa-cog mr-2"></i>
									Cài đặt
								</a>
								
								<button
									onclick={handleLogout}
									class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
									aria-label="Đăng xuất"
								>
									<i class="fas fa-sign-out-alt mr-2"></i>
									Đăng xuất
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</header>

<!-- Overlay for mobile -->
{#if dropdownOpen}
	<div class="fixed inset-0 z-40" onclick={() => dropdownOpen = false} aria-hidden="true"></div>
{/if}

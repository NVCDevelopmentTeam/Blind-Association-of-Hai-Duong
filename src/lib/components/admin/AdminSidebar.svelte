<script>
	import { page } from '$app/stores';
	
	let { open = false, onfoo } = $props();
	
	const menuItems = [
		{
			title: 'Bảng điều khiển',
			icon: 'fas fa-tachometer-alt',
			href: '/admin/dashboard',
			active: true
		},
		{
			title: 'Bài viết',
			icon: 'fas fa-newspaper',
			href: '/admin/dashboard/posts',
			submenu: [
				{ title: 'Tất cả bài viết', href: '/admin/dashboard/posts' },
				{ title: 'Thêm mới', href: '/admin/dashboard/posts/new' },
				{ title: 'Danh mục', href: '/admin/dashboard/categories' },
				{ title: 'Thẻ', href: '/admin/dashboard/tags' }
			]
		},
		{
			title: 'Trang',
			icon: 'fas fa-file-alt',
			href: '/admin/dashboard/pages'
		},
		{
			title: 'Media',
			icon: 'fas fa-images',
			href: '/admin/dashboard/media'
		},
		{
			title: 'Bình luận',
			icon: 'fas fa-comments',
			href: '/admin/dashboard/comments'
		},
		{
			title: 'Người dùng',
			icon: 'fas fa-users',
			href: '/admin/dashboard/users'
		},
		{
			title: 'Giao diện',
			icon: 'fas fa-paint-brush',
			href: '/admin/dashboard/appearance',
			submenu: [
				{ title: 'Themes', href: '/admin/dashboard/themes' },
				{ title: 'Menu', href: '/admin/dashboard/menus' },
				{ title: 'Widgets', href: '/admin/dashboard/widgets' }
			]
		},
		{
			title: 'Cài đặt',
			icon: 'fas fa-cog',
			href: '/admin/dashboard/settings'
		}
	];
	
	function isActive(href) {
		return $page.url.pathname === href;
	}
	
	function closeSidebar() {
		open = false;
		if (onfoo) {
			onfoo();
		}
	}
</script>

<!-- Mobile overlay -->
{#if open}
	<div class="fixed inset-0 z-40 lg:hidden" role="button" tabindex="0" aria-label="Close sidebar" onclick={closeSidebar} onkeydown={(e) => { if (e.key === 'Enter') closeSidebar(); }}></div>
{/if}

<!-- Sidebar -->
<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform {open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
	<div class="flex flex-col h-full">
		<!-- Sidebar header -->
		<div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center">
				<i class="fas fa-shield-alt text-blue-600 text-xl"></i>
				<span class="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Admin</span>
			</div>
			<button onclick={closeSidebar} class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close sidebar">
				<i class="fas fa-times"></i>
			</button>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
			{#each menuItems as item}
				<div>
					<a
						href={item.href}
						class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors {isActive(item.href) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
						onclick={closeSidebar}
						aria-label={item.title}
					>
						<i class="{item.icon} mr-3"></i>
						{item.title}
						{#if item.submenu}
							<i class="fas fa-chevron-down ml-auto"></i>
						{/if}
					</a>
					
					{#if item.submenu}
						<div class="ml-6 mt-2 space-y-1">
							{#each item.submenu as subitem}
								<a
									href={subitem.href}
									class="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors {isActive(subitem.href) ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : ''}"
									onclick={closeSidebar}
									aria-label={subitem.title}
								>
									{subitem.title}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</nav>

		<!-- Sidebar footer -->
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<a href="/" class="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="View website">
				<i class="fas fa-external-link-alt mr-3"></i>
				Xem website
			</a>
		</div>
	</div>
</div>

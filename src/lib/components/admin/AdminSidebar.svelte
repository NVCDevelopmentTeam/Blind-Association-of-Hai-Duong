<script>
	import { page } from '$app/stores';
	
	let { sidebarOpen } = $props();
	
	const menuItems = [
		{ 
			id: 'dashboard', 
			label: 'Tổng quan', 
			icon: 'fa-tachometer-alt', 
			href: '/admin/dashboard',
			children: []
		},
		{ 
			id: 'posts', 
			label: 'Bài viết', 
			icon: 'fa-newspaper', 
			href: '/admin/dashboard/posts',
			children: [
				{ label: 'Tất cả bài viết', href: '/admin/dashboard/posts' },
				{ label: 'Thêm mới', href: '/admin/dashboard/posts/new' },
				{ label: 'Danh mục', href: '/admin/dashboard/categories' },
				{ label: 'Thẻ', href: '/admin/dashboard/tags' }
			]
		},
		{ 
			id: 'pages', 
			label: 'Trang', 
			icon: 'fa-file-alt', 
			href: '/admin/dashboard/pages',
			children: [
				{ label: 'Tất cả trang', href: '/admin/dashboard/pages' },
				{ label: 'Thêm trang mới', href: '/admin/dashboard/pages/new' }
			]
		},
		{ 
			id: 'media', 
			label: 'Thư viện', 
			icon: 'fa-images', 
			href: '/admin/dashboard/media',
			children: []
		},
		{ 
			id: 'comments', 
			label: 'Bình luận', 
			icon: 'fa-comments', 
			href: '/admin/dashboard/comments',
			children: []
		},
		{ 
			id: 'users', 
			label: 'Người dùng', 
			icon: 'fa-users', 
			href: '/admin/dashboard/users',
			children: []
		},
		{ 
			id: 'chat', 
			label: 'Live Chat', 
			icon: 'fa-comment-dots', 
			href: '/admin/dashboard/chat',
			children: []
		},
		{ 
			id: 'appearance', 
			label: 'Giao diện', 
			icon: 'fa-paint-brush', 
			href: '/admin/dashboard/appearance',
			children: [
				{ label: 'Themes', href: '/admin/dashboard/appearance/themes' },
				{ label: 'Tùy chỉnh', href: '/admin/dashboard/appearance/customize' },
				{ label: 'Menu', href: '/admin/dashboard/appearance/menus' }
			]
		},
		{ 
			id: 'settings', 
			label: 'Cài đặt', 
			icon: 'fa-cog', 
			href: '/admin/dashboard/settings',
			children: [
				{ label: 'Chung', href: '/admin/dashboard/settings' },
				{ label: 'SEO', href: '/admin/dashboard/settings/seo' },
				{ label: 'Bảo mật', href: '/admin/dashboard/settings/security' }
			]
		}
	];
	
	let expandedItems = $state(new Set());
	
	function toggleExpanded(itemId) {
		if (expandedItems.has(itemId)) {
			expandedItems.delete(itemId);
		} else {
			expandedItems.add(itemId);
		}
		expandedItems = new Set(expandedItems);
	}
	
	function isActive(href) {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}
</script>

<aside class="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 {sidebarOpen ? 'w-64' : 'w-16'} overflow-y-auto">
	<nav class="p-4">
		<ul class="space-y-2">
			{#each menuItems as item}
				<li>
					{#if item.children.length > 0}
						<div>
							<button 
								onclick={() => toggleExpanded(item.id)}
								class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors {isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
								title={item.label}
							>
								<div class="flex items-center gap-3">
									<i class="fas {item.icon} {sidebarOpen ? '' : 'text-center w-full'}"></i>
									{#if sidebarOpen}
										<span>{item.label}</span>
									{/if}
								</div>
								{#if sidebarOpen}
									<i class="fas fa-chevron-{expandedItems.has(item.id) ? 'up' : 'down'} text-xs"></i>
								{/if}
							</button>
							
							{#if sidebarOpen && expandedItems.has(item.id)}
								<ul class="mt-2 ml-6 space-y-1">
									{#each item.children as child}
										<li>
											<a 
												href={child.href}
												class="block px-3 py-2 text-sm rounded-lg transition-colors {isActive(child.href) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}"
											>
												{child.label}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{:else}
						<a 
							href={item.href}
							class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors {isActive(item.href) ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
							title={item.label}
						>
							<i class="fas {item.icon} {sidebarOpen ? '' : 'text-center w-full'}"></i>
							{#if sidebarOpen}
								<span>{item.label}</span>
							{/if}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
</aside>

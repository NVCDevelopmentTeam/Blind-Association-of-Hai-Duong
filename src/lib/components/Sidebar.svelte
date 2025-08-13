<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let categories = $state([]);
	let recentPosts = $state([]);
	let visitorStats = $state({
		todayVisitors: 0,
		totalVisitors: 0,
		onlineUsers: 0
	});
	let loading = $state(true);

	onMount(async () => {
		if (!browser) return;

		try {
			// Fetch categories
			const categoriesResponse = await fetch('http://localhost:3001/api/categories');
			if (categoriesResponse.ok) {
				categories = await categoriesResponse.json();
			}

			// Fetch recent posts
			const postsResponse = await fetch('http://localhost:3001/api/posts?limit=5&status=PUBLISHED');
			if (postsResponse.ok) {
				const postsResult = await postsResponse.json();
				recentPosts = postsResult.posts || [];
			}

			// Fetch visitor statistics
			const statsResponse = await fetch('http://localhost:3001/api/admin/statistics');
			if (statsResponse.ok) {
				const stats = await statsResponse.json();
				visitorStats = {
					todayVisitors: stats.todayVisitors || 0,
					totalVisitors: stats.totalVisitors || 0,
					onlineUsers: stats.onlineUsers || 0
				};
			}
		} catch (error) {
			console.error('Error fetching sidebar data:', error);
		} finally {
			loading = false;
		}
	});
</script>

<aside class="space-y-8" aria-label="Thanh bên">
	<!-- Visitor Statistics -->
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
	>
		<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
			<i class="fas fa-chart-line text-green-600 mr-2" aria-hidden="true"></i>
			Thống kê truy cập
		</h3>

		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<div class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
					<span class="text-sm text-gray-600 dark:text-gray-400">Đang online</span>
				</div>
				<span class="text-lg font-semibold text-gray-900 dark:text-white">
					{visitorStats.onlineUsers}
				</span>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
					<span class="text-sm text-gray-600 dark:text-gray-400">Hôm nay</span>
				</div>
				<span class="text-lg font-semibold text-gray-900 dark:text-white">
					{visitorStats.todayVisitors}
				</span>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
					<span class="text-sm text-gray-600 dark:text-gray-400">Tổng cộng</span>
				</div>
				<span class="text-lg font-semibold text-gray-900 dark:text-white">
					{visitorStats.totalVisitors.toLocaleString('vi-VN')}
				</span>
			</div>
		</div>
	</div>

	<!-- Categories -->
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
	>
		<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
			<i class="fas fa-folder text-blue-600 mr-2" aria-hidden="true"></i>
			Danh mục
		</h3>

		{#if loading}
			<div class="space-y-2">
				{#each Array(5) as _}
					<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
				{/each}
			</div>
		{:else if categories.length > 0}
			<ul class="space-y-2">
				{#each categories as category}
					<li>
						<a
							href="/danh-muc/{category.slug}"
							class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
						>
							<div class="flex items-center">
								<div
									class="w-3 h-3 rounded-full mr-3"
									style="background-color: {category.color || '#3B82F6'}"
								></div>
								<span
									class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
								>
									{category.name}
								</span>
							</div>
							<span
								class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full"
							>
								{category._count?.posts || 0}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-gray-500 dark:text-gray-400 text-sm">Chưa có danh mục nào</p>
		{/if}
	</div>

	<!-- Recent Posts -->
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
	>
		<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
			<i class="fas fa-clock text-green-600 mr-2" aria-hidden="true"></i>
			Bài viết gần đây
		</h3>

		{#if loading}
			<div class="space-y-4">
				{#each Array(3) as _}
					<div class="flex space-x-3">
						<div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						<div class="flex-1 space-y-2">
							<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
						</div>
					</div>
				{/each}
			</div>
		{:else if recentPosts.length > 0}
			<div class="space-y-4">
				{#each recentPosts as post}
					<article class="flex space-x-3 group">
						{#if post.featuredImage}
							<div class="flex-shrink-0">
								<img
									src={post.featuredImage || '/placeholder.svg'}
									alt={post.title}
									class="w-16 h-16 object-cover rounded-md"
									loading="lazy"
								/>
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<h4
								class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
							>
								<a href="/tin-tuc/{post.slug}">
									{post.title}
								</a>
							</h4>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
								<time datetime={post.publishedAt}>
									{new Date(post.publishedAt).toLocaleDateString('vi-VN')}
								</time>
							</p>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="text-gray-500 dark:text-gray-400 text-sm">Chưa có bài viết nào</p>
		{/if}
	</div>

	<!-- Quick Contact -->
	<div
		class="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6"
	>
		<h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
			<i class="fas fa-phone text-blue-600 mr-2" aria-hidden="true"></i>
			Liên hệ nhanh
		</h3>

		<div class="space-y-3 text-sm">
			<div class="flex items-center">
				<i class="fas fa-phone text-blue-600 mr-3" aria-hidden="true"></i>
				<a href="tel:+84123456789" class="text-blue-700 dark:text-blue-300 hover:underline">
					+84 123 456 789
				</a>
			</div>
			<div class="flex items-center">
				<i class="fas fa-envelope text-blue-600 mr-3" aria-hidden="true"></i>
				<a
					href="mailto:info@ttphcn-haiduong.vn"
					class="text-blue-700 dark:text-blue-300 hover:underline"
				>
					info@ttphcn-haiduong.vn
				</a>
			</div>
			<div class="flex items-start">
				<i class="fas fa-map-marker-alt text-blue-600 mr-3 mt-0.5" aria-hidden="true"></i>
				<span class="text-blue-700 dark:text-blue-300"> Hải Dương, Việt Nam </span>
			</div>
		</div>

		<a
			href="/lien-he"
			class="inline-flex items-center justify-center w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Liên hệ ngay
			<i class="fas fa-arrow-right ml-2" aria-hidden="true"></i>
		</a>
	</div>
</aside>

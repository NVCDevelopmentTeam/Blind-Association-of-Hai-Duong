<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let stats = $state({
		totalPosts: 0,
		totalUsers: 0,
		totalViews: 0,
		totalComments: 0
	});

	let recentPosts = $state([]);
	let recentComments = $state([]);
	let loading = $state(true);

	onMount(async () => {
		if (browser) {
			try {
				// Mock data for demo
				stats = {
					totalPosts: 45,
					totalUsers: 12,
					totalViews: 1250,
					totalComments: 89
				};

				recentPosts = [
					{
						id: 1,
						title: 'Chương trình đào tạo nghề mới cho người khiếm thị',
						author: 'Admin',
						date: '2024-01-15',
						status: 'published'
					},
					{
						id: 2,
						title: 'Hoạt động từ thiện tháng 1/2024',
						author: 'Admin',
						date: '2024-01-14',
						status: 'draft'
					}
				];

				recentComments = [
					{
						id: 1,
						author: 'Nguyễn Văn A',
						content: 'Cảm ơn trung tâm đã hỗ trợ rất nhiều...',
						post: 'Chương trình đào tạo nghề mới',
						date: '2024-01-15'
					}
				];
			} catch (error) {
				console.error('Error loading dashboard data:', error);
			} finally {
				loading = false;
			}
		}
	});
</script>

<svelte:head>
	<title>Bảng điều khiển - Quản trị viên</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
			<i class="fas fa-tachometer-alt mr-2 text-blue-600"></i>
			Bảng điều khiển
		</h1>
		<p class="text-gray-600 dark:text-gray-400">Chào mừng bạn đến với hệ thống quản trị website</p>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each Array(4) as _}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
					<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
					<div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
						<i class="fas fa-newspaper text-blue-600 text-xl"></i>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng bài viết</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalPosts}</p>
					</div>
				</div>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
						<i class="fas fa-users text-green-600 text-xl"></i>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Người dùng</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
					</div>
				</div>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
						<i class="fas fa-eye text-yellow-600 text-xl"></i>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Lượt xem</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalViews}</p>
					</div>
				</div>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
						<i class="fas fa-comments text-purple-600 text-xl"></i>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Bình luận</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">
							{stats.totalComments}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Content -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Recent Posts -->
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
				<div class="p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						<i class="fas fa-newspaper mr-2 text-blue-600"></i>
						Bài viết gần đây
					</h2>
				</div>
				<div class="p-6">
					{#if recentPosts.length > 0}
						<div class="space-y-4">
							{#each recentPosts as post}
								<div
									class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
								>
									<div class="flex-1">
										<h3 class="font-medium text-gray-900 dark:text-white">{post.title}</h3>
										<p class="text-sm text-gray-600 dark:text-gray-400">
											Bởi {post.author} • {post.date}
										</p>
									</div>
									<span
										class="px-2 py-1 text-xs rounded-full {post.status === 'published'
											? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
											: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}"
									>
										{post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
									</span>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-gray-500 dark:text-gray-400 text-center py-8">Chưa có bài viết nào</p>
					{/if}
				</div>
			</div>

			<!-- Recent Comments -->
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
				<div class="p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">
						<i class="fas fa-comments mr-2 text-purple-600"></i>
						Bình luận gần đây
					</h2>
				</div>
				<div class="p-6">
					{#if recentComments.length > 0}
						<div class="space-y-4">
							{#each recentComments as comment}
								<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<div class="flex items-center justify-between mb-2">
										<h4 class="font-medium text-gray-900 dark:text-white">{comment.author}</h4>
										<span class="text-sm text-gray-500 dark:text-gray-400">{comment.date}</span>
									</div>
									<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{comment.content}</p>
									<p class="text-xs text-gray-500 dark:text-gray-500">Trên: {comment.post}</p>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-gray-500 dark:text-gray-400 text-center py-8">Chưa có bình luận nào</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				<i class="fas fa-bolt mr-2 text-yellow-600"></i>
				Thao tác nhanh
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<a
					href="/admin/dashboard/posts/new"
					class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
				>
					<i class="fas fa-plus text-blue-600 text-xl mr-3"></i>
					<div>
						<h3 class="font-medium text-gray-900 dark:text-white">Tạo bài viết mới</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">Viết bài viết mới</p>
					</div>
				</a>

				<a
					href="/admin/dashboard/media"
					class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
				>
					<i class="fas fa-images text-green-600 text-xl mr-3"></i>
					<div>
						<h3 class="font-medium text-gray-900 dark:text-white">Quản lý media</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">Tải lên hình ảnh</p>
					</div>
				</a>

				<a
					href="/admin/dashboard/settings"
					class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
				>
					<i class="fas fa-cog text-purple-600 text-xl mr-3"></i>
					<div>
						<h3 class="font-medium text-gray-900 dark:text-white">Cài đặt</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">Cấu hình website</p>
					</div>
				</a>
			</div>
		</div>
	{/if}
</div>

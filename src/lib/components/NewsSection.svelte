<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import NewsCard from './NewsCard.svelte';

	let news = $state([]);
	let loading = $state(true);
	let error = $state(null);

	onMount(async () => {
		if (!browser) return;

		try {
			const response = await fetch('http://localhost:3001/api/posts?limit=6&status=PUBLISHED');
			if (response.ok) {
				const result = await response.json();
				news = result.posts || [];
			} else {
				error = 'Không thể tải tin tức';
			}
		} catch (err) {
			console.error('Error fetching news:', err);
			error = 'Lỗi kết nối';
		} finally {
			loading = false;
		}
	});
</script>

<section class="space-y-8">
	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each Array(6) as _}
				<div
					class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
				>
					<div class="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
					<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
					<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
					<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
					<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
				</div>
			{/each}
		</div>
	{:else if error}
		<div class="text-center py-12">
			<div class="text-red-500 dark:text-red-400 mb-4">
				<i class="fas fa-exclamation-triangle text-4xl" aria-hidden="true"></i>
			</div>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Không thể tải tin tức</h3>
			<p class="text-gray-600 dark:text-gray-400">
				{error}
			</p>
			<button
				onclick={() => window.location.reload()}
				class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
			>
				<i class="fas fa-redo mr-2" aria-hidden="true"></i>
				Thử lại
			</button>
		</div>
	{:else if news.length === 0}
		<div class="text-center py-12">
			<div class="text-gray-400 dark:text-gray-500 mb-4">
				<i class="fas fa-newspaper text-4xl" aria-hidden="true"></i>
			</div>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Chưa có tin tức</h3>
			<p class="text-gray-600 dark:text-gray-400">Hiện tại chưa có bài viết nào được đăng tải</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each news as article}
				<NewsCard {article} />
			{/each}
		</div>

		<!-- View More Button -->
		<div class="text-center mt-8">
			<a
				href="/tin-tuc"
				class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Xem tất cả tin tức
				<i class="fas fa-arrow-right ml-2" aria-hidden="true"></i>
			</a>
		</div>
	{/if}
</section>

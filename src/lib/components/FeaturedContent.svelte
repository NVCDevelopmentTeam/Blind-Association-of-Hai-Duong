<script>
	let { featuredData = [] } = $props();
</script>

<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
	<div class="flex justify-between items-center mb-6">
		<h2 class="text-2xl font-bold">Nội dung nổi bật</h2>
		<a href="/noi-bat" class="text-blue-600 hover:text-blue-800 transition-colors">
			Xem tất cả →
		</a>
	</div>
	
	{#if featuredData.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each featuredData.slice(0, 4) as item}
				<article class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-shadow">
					<h3 class="font-bold text-lg mb-2">
						<a href={item.url} class="hover:text-blue-600 transition-colors">
							{item.title}
						</a>
					</h3>
					<p class="text-gray-600 dark:text-gray-300 text-sm mb-3">{item.excerpt}</p>
					<div class="flex items-center justify-between">
						<span class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
							{item.category}
						</span>
						<a href={item.url} class="text-blue-600 hover:text-blue-800 text-sm font-medium">
							Đọc thêm →
						</a>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div class="text-center py-8 text-gray-500 dark:text-gray-400">
			<i class="fas fa-star text-4xl mb-4 opacity-50" aria-hidden="true"></i>
			<p>Nội dung nổi bật sẽ được cập nhật sớm</p>
		</div>
	{/if}
</section>

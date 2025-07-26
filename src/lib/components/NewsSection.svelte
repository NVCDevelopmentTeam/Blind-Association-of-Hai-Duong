<script>
	import NewsCard from './NewsCard.svelte';
	
	let { newsData = [] } = $props();
</script>

<section class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
	<div class="flex justify-between items-center mb-6">
		<h2 class="text-2xl font-bold">Tin tức mới nhất</h2>
		<a href="/tin-tuc" class="text-blue-600 hover:text-blue-800">
			Xem tất cả →
		</a>
	</div>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each newsData.slice(0, 6) as article}
			<NewsCard {article} />
		{:else}
			<div class="col-span-full text-center py-8 text-gray-500">
				<i class="fas fa-newspaper text-4xl mb-4 opacity-50" aria-hidden="true"></i>
				<p>Đang tải tin tức...</p>
			</div>
		{/each}
	</div>
</section>

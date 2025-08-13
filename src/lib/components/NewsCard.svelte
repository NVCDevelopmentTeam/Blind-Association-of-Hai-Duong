<script>
	import ShareButton from './ShareButton.svelte';

	let { article } = $props();

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getReadingTime(content) {
		const wordsPerMinute = 200;
		const words = content.split(' ').length;
		const minutes = Math.ceil(words / wordsPerMinute);
		return minutes;
	}
</script>

<article
	class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
>
	<!-- Featured Image -->
	{#if article.featuredImage}
		<div class="aspect-w-16 aspect-h-9 overflow-hidden">
			<img
				src={article.featuredImage || '/placeholder.svg'}
				alt={article.title}
				class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
				loading="lazy"
			/>
		</div>
	{/if}

	<div class="p-6">
		<!-- Category and Date -->
		<div class="flex items-center justify-between mb-3">
			{#if article.categories && article.categories.length > 0}
				<span
					class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
				>
					{article.categories[0].category.name}
				</span>
			{/if}
			<time datetime={article.publishedAt} class="text-sm text-gray-500 dark:text-gray-400">
				{formatDate(article.publishedAt)}
			</time>
		</div>

		<!-- Title -->
		<h3
			class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
		>
			<a href="/tin-tuc/{article.slug}">
				{article.title}
			</a>
		</h3>

		<!-- Excerpt -->
		{#if article.excerpt}
			<p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
				{article.excerpt}
			</p>
		{/if}

		<!-- Meta Information -->
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
				{#if article.author}
					<div class="flex items-center">
						<i class="fas fa-user mr-1" aria-hidden="true"></i>
						<span>{article.author.name}</span>
					</div>
				{/if}
				<div class="flex items-center">
					<i class="fas fa-clock mr-1" aria-hidden="true"></i>
					<span>{getReadingTime(article.content)} phút đọc</span>
				</div>
				{#if article._count?.comments}
					<div class="flex items-center">
						<i class="fas fa-comments mr-1" aria-hidden="true"></i>
						<span>{article._count.comments}</span>
					</div>
				{/if}
			</div>

			<!-- Share Button -->
			<ShareButton
				url="/tin-tuc/{article.slug}"
				title={article.title}
				description={article.excerpt}
			/>
		</div>

		<!-- Tags -->
		{#if article.tags && article.tags.length > 0}
			<div class="mt-4 flex flex-wrap gap-2">
				{#each article.tags.slice(0, 3) as tagRelation}
					<span
						class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
					>
						#{tagRelation.tag.name}
					</span>
				{/each}
				{#if article.tags.length > 3}
					<span
						class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
					>
						+{article.tags.length - 3}
					</span>
				{/if}
			</div>
		{/if}
	</div>
</article>

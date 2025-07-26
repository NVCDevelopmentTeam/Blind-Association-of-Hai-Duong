<script>
	import { formatDate } from '$lib/utils/date.js';
	import ShareButton from './ShareButton.svelte';
	import TextToSpeech from './TextToSpeech.svelte';
	
	let { article } = $props();
</script>

<article class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
	{#if article.image}
		<img 
			src={article.image || "/placeholder.svg?height=300&width=400"} 
			alt={article.title}
			class="w-full h-48 object-cover"
			loading="lazy"
		/>
	{/if}
	
	<div class="p-6">
		<div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
			<i class="fas fa-calendar" aria-hidden="true"></i>
			<time datetime={article.publishedAt}>
				{formatDate(article.publishedAt)}
			</time>
			{#if article.category}
				<span class="mx-2">•</span>
				<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
					{article.category}
				</span>
			{/if}
		</div>
		
		<h3 class="font-bold text-xl mb-2 line-clamp-2">
			<a href="/tin-tuc/{article.slug}" class="hover:text-blue-600 transition-colors">
				{article.title}
			</a>
		</h3>
		
		<p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
			{article.excerpt}
		</p>
		
		<div class="flex items-center justify-between">
			<a 
				href="/tin-tuc/{article.slug}" 
				class="text-blue-600 hover:text-blue-800 font-medium"
			>
				Đọc thêm →
			</a>
			
			<div class="flex items-center gap-2">
				<ShareButton url="/tin-tuc/{article.slug}" title={article.title} />
				<TextToSpeech text={article.content || article.excerpt} />
			</div>
		</div>
	</div>
</article>

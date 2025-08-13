<script>
	import { onMount } from 'svelte';
	import NewsEditor from './NewsEditor.svelte';
	import { derived } from 'svelte/store';
	import { writable } from 'svelte/store';

	let articles = [];
	const showEditor = writable(false);
	const editingArticle = writable(null);
	const loading = writable(true);
	const searchQuery = writable('');
	const selectedCategory = writable('all');

	const categories = [
		{ value: 'all', label: 'Tất cả' },
		{ value: 'Đào tạo', label: 'Đào tạo' },
		{ value: 'Việc làm', label: 'Việc làm' },
		{ value: 'Hoạt động', label: 'Hoạt động' },
		{ value: 'Hỗ trợ', label: 'Hỗ trợ' }
	];

	// Computed filtered articles
	const filteredArticles = derived(
		[articles, searchQuery, selectedCategory],
		([$articles, $searchQuery, $selectedCategory]) => {
			return $articles.filter((article) => {
				const matchesSearch =
					article.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
					article.excerpt.toLowerCase().includes($searchQuery.toLowerCase());
				const matchesCategory =
					$selectedCategory === 'all' || article.category === $selectedCategory;
				return matchesSearch && matchesCategory;
			});
		}
	);

	$effect(() => {
		if ($showEditor) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	onMount(async () => {
		await loadArticles();
	});

	async function loadArticles() {
		$loading = true;
		try {
			const response = await fetch('/api/admin/news');
			if (response.ok) {
				articles = await response.json();
			}
		} catch (error) {
			console.error('Error loading articles:', error);
		} finally {
			$loading = false;
		}
	}

	function openEditor(article = null) {
		$editingArticle = article;
		$showEditor = true;
	}

	function closeEditor() {
		$showEditor = false;
		$editingArticle = null;
	}

	async function deleteArticle(id) {
		if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

		try {
			const response = await fetch(`/api/admin/news/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await loadArticles();
			}
		} catch (error) {
			console.error('Error deleting article:', error);
		}
	}

	async function toggleFeatured(id, featured) {
		try {
			const response = await fetch(`/api/admin/news/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ featured: !featured })
			});

			if (response.ok) {
				await loadArticles();
			}
		} catch (error) {
			console.error('Error updating article:', error);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-800 dark:text-white">Quản lý tin tức</h2>
		<button
			onclick={() => openEditor()}
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			aria-label="Thêm bài viết"
		>
			<i class="fas fa-plus mr-2"></i>
			Thêm bài viết
		</button>
	</div>

	<!-- Filters -->
	<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex-1">
				<input
					type="search"
					bind:value={$searchQuery}
					placeholder="Tìm kiếm bài viết..."
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			<div>
				<select
					bind:value={$selectedCategory}
					class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				>
					{#each categories as category}
						<option value={category.value}>{category.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Articles List -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
		{#if $loading}
			<div class="flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		{:else if $filteredArticles.length === 0}
			<div class="text-center py-12 text-gray-500 dark:text-gray-400">
				<i class="fas fa-newspaper text-4xl mb-4 opacity-50"></i>
				<p>Không tìm thấy bài viết nào</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Tiêu đề
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Danh mục
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Ngày đăng
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Trạng thái
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Thao tác
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						{#each $filteredArticles as article}
							<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
								<td class="px-6 py-4">
									<div class="flex items-center">
										{#if article.image}
											<img
												src={article.image || '/placeholder.svg'}
												alt=""
												class="w-12 h-12 rounded-lg object-cover mr-4"
											/>
										{/if}
										<div>
											<div class="text-sm font-medium text-gray-900 dark:text-white">
												{article.title}
											</div>
											<div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
												{article.excerpt}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<span
										class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
									>
										{article.category}
									</span>
								</td>
								<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
									{new Date(article.publishedAt).toLocaleDateString('vi-VN')}
								</td>
								<td class="px-6 py-4">
									<button
										onclick={() => toggleFeatured(article.id, article.featured)}
										class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full {article.featured
											? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
											: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}"
										aria-label={article.featured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
									>
										<i class="fas {article.featured ? 'fa-star' : 'fa-star-o'} mr-1"></i>
										{article.featured ? 'Nổi bật' : 'Thường'}
									</button>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<button
											onclick={() => openEditor(article)}
											class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
											title="Chỉnh sửa"
											aria-label="Chỉnh sửa bài viết"
										>
											<i class="fas fa-edit"></i>
										</button>
										<button
											onclick={() => deleteArticle(article.id)}
											class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
											title="Xóa"
											aria-label="Xóa bài viết"
										>
											<i class="fas fa-trash"></i>
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

{#if $showEditor}
	<NewsEditor article={$editingArticle} onclose={closeEditor} onsave={loadArticles} />
{/if}

<script>
	import { onMount } from 'svelte';
	
	let { article, onClose, onSave } = $props();
	
	let form = $state({
		title: '',
		slug: '',
		excerpt: '',
		content: '',
		category: 'Đào tạo',
		image: '',
		featured: false,
		publishedAt: new Date().toISOString().slice(0, 16)
	});
	
	let saving = $state(false);
	let imageFile = $state(null);
	
	const categories = [
		'Đào tạo',
		'Việc làm', 
		'Hoạt động',
		'Hỗ trợ',
		'Hội thảo'
	];
	
	onMount(() => {
		if (article) {
			form = { ...article };
			form.publishedAt = new Date(article.publishedAt).toISOString().slice(0, 16);
		}
	});
	
	function generateSlug(title) {
		return title
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[đĐ]/g, 'd')
			.replace(/[^a-z0-9\s]/g, '')
			.replace(/\s+/g, '-')
			.replace(/^-+|-+$/g, '');
	}
	
	function handleTitleChange() {
		if (!article) {
			form.slug = generateSlug(form.title);
		}
	}
	
	async function handleImageUpload(event) {
		const file = event.target.files[0];
		if (!file) return;
		
		imageFile = file;
		
		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			form.image = e.target.result;
		};
		reader.readAsDataURL(file);
	}
	
	async function handleSubmit(event) {
		event.preventDefault();
		saving = true;
		
		try {
			let imageUrl = form.image;
			
			// Upload image if new file selected
			if (imageFile) {
				const formData = new FormData();
				formData.append('image', imageFile);
				
				const uploadResponse = await fetch('/api/admin/upload', {
					method: 'POST',
					body: formData
				});
				
				if (uploadResponse.ok) {
					const uploadData = await uploadResponse.json();
					imageUrl = uploadData.url;
				}
			}
			
			const articleData = {
				...form,
				image: imageUrl,
				publishedAt: new Date(form.publishedAt).toISOString()
			};
			
			const url = article ? `/api/admin/news/${article.id}` : '/api/admin/news';
			const method = article ? 'PUT' : 'POST';
			
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(articleData)
			});
			
			if (response.ok) {
				onSave();
				onClose();
			} else {
				alert('Có lỗi xảy ra khi lưu bài viết');
			}
		} catch (error) {
			console.error('Error saving article:', error);
			alert('Có lỗi xảy ra khi lưu bài viết');
		} finally {
			saving = false;
		}
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
		<div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
			<div class="flex justify-between items-center">
				<h3 class="text-xl font-bold text-gray-800 dark:text-white">
					{article ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
				</h3>
				<button 
					onclick={onClose}
					aria-label="Close"
					class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					<i class="fas fa-times text-xl"></i>
				</button>
			</div>
		</div>
		
		<form onsubmit={handleSubmit} class="p-6 space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Tiêu đề *
					</label>
					<input 
						type="text"
						id="title"
						bind:value={form.title}
						oninput={handleTitleChange}
						required
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				
				<div>
					<label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Slug *
					</label>
					<input 
						type="text"
						id="slug"
						bind:value={form.slug}
						required
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>
			
			<div>
				<label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Tóm tắt *
				</label>
				<textarea 
					id="excerpt"
					bind:value={form.excerpt}
					rows="3"
					required
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				></textarea>
			</div>
			
			<div>
				<label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Nội dung *
				</label>
				<textarea 
					id="content"
					bind:value={form.content}
					rows="10"
					required
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				></textarea>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Danh mục *
					</label>
					<select 
						id="category"
						bind:value={form.category}
						required
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>
				
				<div>
					<label for="publishedAt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Ngày đăng *
					</label>
					<input 
						type="datetime-local"
						id="publishedAt"
						bind:value={form.publishedAt}
						required
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				
				<div class="flex items-center">
					<label class="flex items-center">
						<input 
							type="checkbox"
							bind:checked={form.featured}
							class="mr-2"
						/>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
							Bài viết nổi bật
						</span>
					</label>
				</div>
			</div>
			
			<div>
				<label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Hình ảnh
				</label>
				<input 
					type="file"
					id="image"
					accept="image/*"
					onchange={handleImageUpload}
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				/>
				{#if form.image}
					<div class="mt-2">
						<img src={form.image || "/placeholder.svg"} alt="Preview" class="w-32 h-32 object-cover rounded-lg" />
					</div>
				{/if}
			</div>
			
			<div class="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
				<button 
					type="button"
					onclick={onClose}
					aria-label="Cancel"
					class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					Hủy
				</button>
				<button 
					type="submit"
					disabled={saving}
					aria-label="Save"
					class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
				>
					{saving ? 'Đang lưu...' : 'Lưu bài viết'}
				</button>
			</div>
		</form>
	</div>
</div>

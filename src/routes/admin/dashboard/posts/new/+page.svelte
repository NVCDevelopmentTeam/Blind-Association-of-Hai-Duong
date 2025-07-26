<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Quill from 'quill'; // Declare Quill variable

	let form = $state({
		title: '',
		slug: '',
		content: '',
		excerpt: '',
		featuredImage: '',
		status: 'DRAFT',
		type: 'POST',
		metaTitle: '',
		metaDescription: '',
		publishedAt: new Date().toISOString().slice(0, 16),
		categories: [],
		tags: []
	});
	
	let categories = [
		{ id: '1', name: 'Đào tạo', slug: 'dao-tao' },
		{ id: '2', name: 'Việc làm', slug: 'viec-lam' },
		{ id: '3', name: 'Hoạt động', slug: 'hoat-dong' },
		{ id: '4', name: 'Hỗ trợ', slug: 'ho-tro' }
	];
	
	let tags = [
		{ id: '1', name: 'CNTT', slug: 'cntt' },
		{ id: '2', name: 'Massage', slug: 'massage' },
		{ id: '3', name: 'Thủ công', slug: 'thu-cong' },
		{ id: '4', name: 'Tư vấn', slug: 'tu-van' }
	];
	
	let saving = $state(false);
	let imageFile = null;
	let quillEditor = null;
	
	onMount(() => {
		if (!browser) return;
		
		// Initialize Quill editor
		if (typeof Quill !== 'undefined') {
			const toolbarOptions = [
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
				[{ 'font': [] }],
				[{ 'size': ['small', false, 'large', 'huge'] }],
				['bold', 'italic', 'underline', 'strike'],
				[{ 'color': [] }, { 'background': [] }],
				[{ 'script': 'sub'}, { 'script': 'super' }],
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'indent': '-1'}, { 'indent': '+1' }],
				[{ 'direction': 'rtl' }],
				[{ 'align': [] }],
				['blockquote', 'code-block'],
				['link', 'image', 'video'],
				['clean']
			];
			
			quillEditor = new Quill('#editor', {
				theme: 'snow',
				placeholder: 'Viết nội dung bài viết...',
				modules: {
					toolbar: toolbarOptions
				}
			});
			
			// Listen for changes
			quillEditor.on('text-change', () => {
				form.content = quillEditor.root.innerHTML;
				
				// Auto-generate excerpt if empty
				if (!form.excerpt) {
					const textContent = quillEditor.getText();
					form.excerpt = textContent.substring(0, 160) + (textContent.length > 160 ? '...' : '');
				}
			});
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
		if (!form.slug) {
			form.slug = generateSlug(form.title);
		}
		if (!form.metaTitle) {
			form.metaTitle = form.title;
		}
	}
	
	async function handleImageUpload(event) {
		const file = event.target.files[0];
		if (!file) return;
		
		imageFile = file;
		
		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			form.featuredImage = e.target.result;
		};
		reader.readAsDataURL(file);
	}
	
	async function handleSubmit(event) {
		event.preventDefault();
		saving = true;
		
		try {
			// Mock save - in real app, this would call API
			console.log('Saving post:', form);
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			alert('Bài viết đã được lưu thành công!');
			goto('/admin/dashboard/posts');
		} catch (error) {
			console.error('Error saving post:', error);
			alert('Có lỗi xảy ra khi lưu bài viết');
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Tạo bài viết mới - Quản trị hệ thống</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tạo bài viết mới</h1>
		<div class="flex gap-3">
			<button 
				type="button"
				onclick={() => goto('/admin/dashboard/posts')}
				class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
			>
				Hủy
			</button>
			<button 
				type="submit"
				form="post-form"
				disabled={saving}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
			>
				{saving ? 'Đang lưu...' : 'Lưu bài viết'}
			</button>
		</div>
	</div>
	
	<form id="post-form" onsubmit={handleSubmit} class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Title -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Tiêu đề *
				</label>
				<input 
					type="text"
					id="title"
					bind:value={form.title}
					oninput={handleTitleChange}
					required
					class="w-full px-4 py-3 text-xl border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					placeholder="Nhập tiêu đề bài viết..."
				/>
			</div>
			
			<!-- Slug -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Đường dẫn (Slug) *
				</label>
				<div class="flex items-center">
					<span class="text-gray-500 dark:text-gray-400 mr-2">/{form.type.toLowerCase()}/</span>
					<input 
						type="text"
						id="slug"
						bind:value={form.slug}
						required
						class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
						placeholder="duong-dan-bai-viet"
					/>
				</div>
			</div>
			
			<!-- Content Editor -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<label for="editor" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
					Nội dung *
				</label>
				<div id="editor" class="min-h-[400px] bg-white"></div>
			</div>
			
			<!-- Excerpt -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Tóm tắt
				</label>
				<textarea 
					id="excerpt"
					bind:value={form.excerpt}
					rows="3"
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					placeholder="Tóm tắt ngắn gọn về bài viết..."
				></textarea>
			</div>
		</div>
		
		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Publish Settings -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Xuất bản</h3>
				
				<div class="space-y-4">
					<div>
						<label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Trạng thái
						</label>
						<select 
							id="status"
							bind:value={form.status}
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
						>
							<option value="DRAFT">Bản nháp</option>
							<option value="PUBLISHED">Xuất bản</option>
							<option value="PRIVATE">Riêng tư</option>
						</select>
					</div>
					
					{#if form.status === 'PUBLISHED'}
						<div>
							<label for="publishedAt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Ngày xuất bản
							</label>
							<input 
								type="datetime-local"
								id="publishedAt"
								bind:value={form.publishedAt}
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
							/>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Featured Image -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hình ảnh đại diện</h3>
				
				<div class="space-y-4">
					<input 
						type="file"
						accept="image/*"
						onchange={handleImageUpload}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
					
					{#if form.featuredImage}
						<div class="mt-4">
							<img 
								src={form.featuredImage || "/placeholder.svg"} 
								alt="Preview" 
								class="w-full h-48 object-cover rounded-lg"
							/>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Categories -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Danh mục</h3>
				
				<div class="space-y-2 max-h-48 overflow-y-auto">
					{#each categories as category}
						<label class="flex items-center">
							<input 
								type="checkbox"
								value={category.id}
								bind:group={form.categories}
								class="mr-2 rounded"
							/>
							<span class="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
						</label>
					{/each}
				</div>
			</div>
			
			<!-- Tags -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thẻ</h3>
				
				<div class="space-y-2 max-h-48 overflow-y-auto">
					{#each tags as tag}
						<label class="flex items-center">
							<input 
								type="checkbox"
								value={tag.id}
								bind:group={form.tags}
								class="mr-2 rounded"
							/>
							<span class="text-sm text-gray-700 dark:text-gray-300">{tag.name}</span>
						</label>
					{/each}
				</div>
			</div>
			
			<!-- SEO Settings -->
			<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO</h3>
				
				<div class="space-y-4">
					<div>
						<label for="metaTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Meta Title
						</label>
						<input 
							type="text"
							id="metaTitle"
							bind:value={form.metaTitle}
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
							placeholder="Tiêu đề SEO..."
						/>
					</div>
					
					<div>
						<label for="metaDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Meta Description
						</label>
						<textarea 
							id="metaDescription"
							bind:value={form.metaDescription}
							rows="3"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
							placeholder="Mô tả SEO..."
						></textarea>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

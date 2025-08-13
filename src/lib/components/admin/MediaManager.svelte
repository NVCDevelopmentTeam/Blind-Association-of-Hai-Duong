<script>
	import { onMount } from 'svelte';

	let mediaFiles = $state([]);
	let loading = $state(true);
	let uploading = $state(false);
	let selectedFiles = [];

	onMount(async () => {
		await loadMediaFiles();
	});

	async function loadMediaFiles() {
		loading = true;
		try {
			const response = await fetch('/api/admin/media');
			if (response.ok) {
				mediaFiles = await response.json();
			}
		} catch (error) {
			console.error('Error loading media files:', error);
		} finally {
			loading = false;
		}
	}

	async function handleFileUpload(event) {
		const files = Array.from(event.target.files);
		if (files.length === 0) return;

		uploading = true;

		try {
			for (const file of files) {
				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch('/api/admin/upload', {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					const uploadedFile = await response.json();
					mediaFiles = [uploadedFile, ...mediaFiles];
				}
			}
		} catch (error) {
			console.error('Error uploading files:', error);
		} finally {
			uploading = false;
		}
	}

	async function deleteFile(fileId) {
		if (!confirm('Bạn có chắc chắn muốn xóa file này?')) return;

		try {
			const response = await fetch(`/api/admin/media/${fileId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				mediaFiles = mediaFiles.filter((file) => file.id !== fileId);
			}
		} catch (error) {
			console.error('Error deleting file:', error);
		}
	}

	function copyUrl(url) {
		navigator.clipboard.writeText(url);
		alert('Đã sao chép URL!');
	}

	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-800 dark:text-white">Thư viện Media</h2>
		<label
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
		>
			<i class="fas fa-upload mr-2"></i>
			{uploading ? 'Đang tải lên...' : 'Tải lên file'}
			<input
				type="file"
				multiple
				accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
				onchange={handleFileUpload}
				class="hidden"
				disabled={uploading}
			/>
		</label>
	</div>

	<!-- Media Grid -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
		{#if loading}
			<div class="flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		{:else if mediaFiles.length === 0}
			<div class="text-center py-12 text-gray-500 dark:text-gray-400">
				<i class="fas fa-images text-4xl mb-4 opacity-50"></i>
				<p>Chưa có file media nào</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each mediaFiles as file}
					<div class="relative group bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
						{#if file.type.startsWith('image/')}
							<img
								src={file.url || '/placeholder.svg'}
								alt={file.name}
								class="w-full h-32 object-cover"
							/>
						{:else if file.type.startsWith('video/')}
							<div
								class="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-600"
							>
								<i class="fas fa-video text-2xl text-gray-500"></i>
							</div>
						{:else if file.type.startsWith('audio/')}
							<div
								class="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-600"
							>
								<i class="fas fa-music text-2xl text-gray-500"></i>
							</div>
						{:else}
							<div
								class="w-full h-32 flex items-center justify-center bg-gray-200 dark:bg-gray-600"
							>
								<i class="fas fa-file text-2xl text-gray-500"></i>
							</div>
						{/if}

						<div
							class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
						>
							<button
								onclick={() => copyUrl(file.url)}
								class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
								title="Sao chép URL"
								aria-label="Sao chép URL"
							>
								<i class="fas fa-copy"></i>
							</button>
							<button
								onclick={() => deleteFile(file.id)}
								class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
								title="Xóa file"
								aria-label="Xóa file"
							>
								<i class="fas fa-trash"></i>
							</button>
						</div>

						<div class="p-2">
							<p
								class="text-xs font-medium text-gray-800 dark:text-white truncate"
								title={file.name}
							>
								{file.name}
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								{formatFileSize(file.size)}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

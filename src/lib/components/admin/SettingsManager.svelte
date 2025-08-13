<script>
	import { onMount } from 'svelte';

	let settings = $state({
		siteName: 'Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương',
		siteDescription: 'Nơi hỗ trợ, đào tạo và tạo việc làm cho người khiếm thị',
		contactEmail: 'info@ttphcn-haiduong.vn',
		contactPhone: '+84 123 456 789',
		address: 'Hải Dương, Việt Nam',
		facebookUrl: 'https://facebook.com',
		youtubeUrl: 'https://youtube.com',
		twitterUrl: 'https://twitter.com',
		enableRegistration: true,
		enableComments: true,
		maintenanceMode: false
	});

	let saving = $state(false);

	onMount(async () => {
		await loadSettings();
	});

	async function loadSettings() {
		try {
			const response = await fetch('/api/admin/settings');
			if (response.ok) {
				const data = await response.json();
				settings = { ...settings, ...data };
			}
		} catch (error) {
			console.error('Error loading settings:', error);
		}
	}

	async function saveSettings() {
		saving = true;
		try {
			const response = await fetch('/api/admin/settings', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(settings)
			});

			if (response.ok) {
				alert('Cài đặt đã được lưu thành công!');
			} else {
				alert('Có lỗi xảy ra khi lưu cài đặt');
			}
		} catch (error) {
			console.error('Error saving settings:', error);
			alert('Có lỗi xảy ra khi lưu cài đặt');
		} finally {
			saving = false;
		}
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-800 dark:text-white">Cài đặt hệ thống</h2>
		<button
			onclick={saveSettings}
			disabled={saving}
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
		>
			{saving ? 'Đang lưu...' : 'Lưu cài đặt'}
		</button>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- General Settings -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<h3 class="text-lg font-bold mb-4">Thông tin chung</h3>
			<div class="space-y-4">
				<div>
					<label
						for="siteName"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Tên website
					</label>
					<input
						id="siteName"
						type="text"
						bind:value={settings.siteName}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="siteDescription"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Mô tả website
					</label>
					<textarea
						id="siteDescription"
						bind:value={settings.siteDescription}
						rows="3"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					></textarea>
				</div>

				<div>
					<label
						for="contactEmail"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Email liên hệ
					</label>
					<input
						id="contactEmail"
						type="email"
						bind:value={settings.contactEmail}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="contactPhone"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Số điện thoại
					</label>
					<input
						id="contactPhone"
						type="tel"
						bind:value={settings.contactPhone}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="address"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Địa chỉ
					</label>
					<input
						id="address"
						type="text"
						bind:value={settings.address}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>
		</div>

		<!-- Social Media Settings -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<h3 class="text-lg font-bold mb-4">Mạng xã hội</h3>
			<div class="space-y-4">
				<div>
					<label
						for="facebookUrl"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Facebook URL
					</label>
					<input
						id="facebookUrl"
						type="url"
						bind:value={settings.facebookUrl}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="youtubeUrl"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						YouTube URL
					</label>
					<input
						id="youtubeUrl"
						type="url"
						bind:value={settings.youtubeUrl}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label
						for="twitterUrl"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Twitter URL
					</label>
					<input
						id="twitterUrl"
						type="url"
						bind:value={settings.twitterUrl}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>
		</div>

		<!-- System Settings -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
			<h3 class="text-lg font-bold mb-4">Cài đặt hệ thống</h3>
			<div class="space-y-4">
				<label class="flex items-center">
					<input type="checkbox" bind:checked={settings.enableRegistration} class="mr-3" />
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Cho phép đăng ký tài khoản mới
					</span>
				</label>

				<label class="flex items-center">
					<input type="checkbox" bind:checked={settings.enableComments} class="mr-3" />
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
						Cho phép bình luận
					</span>
				</label>

				<label class="flex items-center">
					<input type="checkbox" bind:checked={settings.maintenanceMode} class="mr-3" />
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300"> Chế độ bảo trì </span>
				</label>
			</div>
		</div>
	</div>
</div>

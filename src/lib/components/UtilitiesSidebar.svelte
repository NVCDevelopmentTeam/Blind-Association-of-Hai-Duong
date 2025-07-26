<script>
	import { onMount } from 'svelte';
	
	let exchangeRates = $state([]);
	let weather = $state(null);
	let statistics = $state({
		onlineUsers: 0,
		todayVisitors: 0,
		totalVisitors: 0
	});

	onMount(async () => {
		// Fetch utilities data
		try {
			// Mock data for demonstration
			exchangeRates = [
				{ currency: 'USD', rate: '24,500 VND' },
				{ currency: 'EUR', rate: '26,800 VND' },
				{ currency: 'JPY', rate: '165 VND' }
			];

			weather = {
				location: 'Hải Dương',
				temperature: 28,
				description: 'Nắng ít mây',
				icon: 'fa-sun'
			};

			statistics = {
				onlineUsers: Math.floor(Math.random() * 50) + 10,
				todayVisitors: Math.floor(Math.random() * 500) + 100,
				totalVisitors: Math.floor(Math.random() * 10000) + 5000
			};
		} catch (error) {
			console.error('Error loading utilities:', error);
		}
	});
</script>

<div class="sticky top-4 space-y-6">
	<!-- Statistics Widget -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
		<h3 class="font-bold text-lg mb-4">Thống kê</h3>
		<div class="space-y-3">
			<div class="flex justify-between items-center">
				<span class="text-sm text-gray-600 dark:text-gray-400">Đang online:</span>
				<span class="font-bold text-green-600">{statistics.onlineUsers}</span>
			</div>
			<div class="flex justify-between items-center">
				<span class="text-sm text-gray-600 dark:text-gray-400">Hôm nay:</span>
				<span class="font-bold text-blue-600">{statistics.todayVisitors}</span>
			</div>
			<div class="flex justify-between items-center">
				<span class="text-sm text-gray-600 dark:text-gray-400">Tổng cộng:</span>
				<span class="font-bold text-purple-600">{statistics.totalVisitors}</span>
			</div>
		</div>
	</div>

	<!-- Weather Widget -->
	{#if weather}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
			<h3 class="font-bold text-lg mb-4">Thời tiết</h3>
			<div class="text-center">
				<div class="text-lg font-bold mb-2">{weather.location}</div>
				<div class="flex items-center justify-center gap-2 mb-2">
					<i class="fas {weather.icon} text-yellow-500 text-xl" aria-hidden="true"></i>
					<span class="text-2xl font-bold">{weather.temperature}°C</span>
				</div>
				<div class="text-sm text-gray-600 dark:text-gray-400">{weather.description}</div>
			</div>
		</div>
	{/if}

	<!-- Exchange Rates Widget -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
		<h3 class="font-bold text-lg mb-4">Tỷ giá ngoại tệ</h3>
		<div class="space-y-2">
			{#each exchangeRates as rate}
				<div class="flex justify-between items-center">
					<span class="font-medium">{rate.currency}</span>
					<span class="text-sm text-gray-600 dark:text-gray-400">{rate.rate}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Quick Tools -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
		<h3 class="font-bold text-lg mb-4">Tiện ích</h3>
		<div class="space-y-2">
			<a href="/tu-dien" class="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
				<i class="fas fa-book mr-2" aria-hidden="true"></i>
				Từ điển Anh-Việt
			</a>
			<a href="/lich-phim" class="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
				<i class="fas fa-film mr-2" aria-hidden="true"></i>
				Lịch chiếu phim
			</a>
			<a href="/thu-vien" class="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors">
				<i class="fas fa-download mr-2" aria-hidden="true"></i>
				Tài liệu tải về
			</a>
		</div>
	</div>
</div>

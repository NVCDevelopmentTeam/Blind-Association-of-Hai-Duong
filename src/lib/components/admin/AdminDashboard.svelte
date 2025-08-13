<script>
	import { onMount } from 'svelte';

	let stats = $state({
		totalNews: 0,
		totalUsers: 0,
		todayVisitors: 0,
		totalVisitors: 0
	});

	let recentActivity = $state([]);

	onMount(async () => {
		// Fetch dashboard data
		try {
			const response = await fetch('/api/admin/dashboard');
			if (response.ok) {
				const data = await response.json();
				stats = data.stats;
				recentActivity = data.recentActivity;
			}
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
		}
	});
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-800 dark:text-white">Tổng quan</h2>
		<div class="text-sm text-gray-500">
			Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Tổng tin tức</p>
					<p class="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalNews}</p>
				</div>
				<div
					class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
				>
					<i class="fas fa-newspaper text-blue-600 dark:text-blue-400"></i>
				</div>
			</div>
		</div>

		<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Người dùng</p>
					<p class="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</p>
				</div>
				<div
					class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center"
				>
					<i class="fas fa-users text-green-600 dark:text-green-400"></i>
				</div>
			</div>
		</div>

		<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Lượt truy cập hôm nay</p>
					<p class="text-2xl font-bold text-gray-800 dark:text-white">{stats.todayVisitors}</p>
				</div>
				<div
					class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center"
				>
					<i class="fas fa-eye text-yellow-600 dark:text-yellow-400"></i>
				</div>
			</div>
		</div>

		<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Tổng lượt truy cập</p>
					<p class="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalVisitors}</p>
				</div>
				<div
					class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center"
				>
					<i class="fas fa-chart-line text-purple-600 dark:text-purple-400"></i>
				</div>
			</div>
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
		<h3 class="text-lg font-bold mb-4">Hoạt động gần đây</h3>
		<div class="space-y-4">
			{#each recentActivity as activity}
				<div class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<div
						class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
					>
						<i class="fas {activity.icon} text-blue-600 dark:text-blue-400"></i>
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-800 dark:text-white">{activity.title}</p>
						<p class="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
					</div>
					<div class="text-xs text-gray-500">
						{activity.time}
					</div>
				</div>
			{:else}
				<p class="text-gray-500 dark:text-gray-400 text-center py-8">Chưa có hoạt động nào</p>
			{/each}
		</div>
	</div>
</div>

<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import io from 'socket.io-client'; // Declare the io variable

	let stats = $state({
		totalPosts: 0,
		totalUsers: 0,
		todayVisitors: 0,
		totalVisitors: 0,
		activeChatSessions: 0
	});
	
	let recentActivity = $state([]);
	let socket = null;
	let onlineUsers = $state(0);
	
	onMount(async () => {
		if (!browser) return;
		
		// Initialize Socket.io if available
		if (typeof io !== 'undefined') {
			try {
				socket = io('http://localhost:3001');
				
				socket.on('connect', () => {
					console.log('Connected to server');
				});
				
				socket.on('admin-notification', (notification) => {
					console.log('Admin notification:', notification);
					// Add to recent activity
					recentActivity = [notification, ...recentActivity.slice(0, 4)];
				});
				
				socket.on('online-users-count', (count) => {
					onlineUsers = count;
				});
			} catch (error) {
				console.error('Socket.io connection error:', error);
			}
		}
		
		// Load dashboard data
		await loadDashboardData();
		
		// Set up real-time updates
		const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
		
		return () => {
			clearInterval(interval);
			if (socket) {
				socket.disconnect();
			}
		};
	});
	
	async function loadDashboardData() {
		try {
			const token = localStorage.getItem('admin_token');
			const response = await fetch('http://localhost:3001/api/admin/statistics', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			
			if (response.ok) {
				stats = await response.json();
			}
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		}
	}
</script>

<svelte:head>
	<title>Bảng điều khiển - Quản trị hệ thống</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bảng điều khiển</h1>
		<div class="text-sm text-gray-500 dark:text-gray-400">
			Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
		<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Tổng bài viết</p>
					<p class="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
					<i class="fas fa-newspaper text-blue-600 dark:text-blue-400 text-xl"></i>
				</div>
			</div>
		</div>
		
		<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Người dùng</p>
					<p class="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
				</div>
				<div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
					<i class="fas fa-users text-green-600 dark:text-green-400 text-xl"></i>
				</div>
			</div>
		</div>
		
		<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Truy cập hôm nay</p>
					<p class="text-3xl font-bold text-gray-900 dark:text-white">{stats.todayVisitors}</p>
				</div>
				<div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
					<i class="fas fa-eye text-yellow-600 dark:text-yellow-400 text-xl"></i>
				</div>
			</div>
		</div>
		
		<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Tổng truy cập</p>
					<p class="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalVisitors}</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
					<i class="fas fa-chart-line text-purple-600 dark:text-purple-400 text-xl"></i>
				</div>
			</div>
		</div>
		
		<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-gray-600 dark:text-gray-400">Chat đang hoạt động</p>
					<p class="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeChatSessions}</p>
				</div>
				<div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
					<i class="fas fa-comments text-indigo-600 dark:text-indigo-400 text-xl"></i>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Real-time Status -->
	<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Trạng thái thời gian thực</h2>
		<div class="flex items-center gap-6">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
				<span class="text-sm text-gray-600 dark:text-gray-400">Hệ thống hoạt động bình thường</span>
			</div>
			<div class="flex items-center gap-2">
				<i class="fas fa-users text-blue-600"></i>
				<span class="text-sm text-gray-600 dark:text-gray-400">{onlineUsers} người dùng trực tuyến</span>
			</div>
		</div>
	</div>
	
	<!-- Quick Actions -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<a href="/admin/dashboard/posts/new" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
					<i class="fas fa-plus text-blue-600 dark:text-blue-400"></i>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">Tạo bài viết</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">Viết bài viết mới</p>
				</div>
			</div>
		</a>
		
		<a href="/admin/dashboard/media" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
					<i class="fas fa-upload text-green-600 dark:text-green-400"></i>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">Tải lên media</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">Quản lý hình ảnh, video</p>
				</div>
			</div>
		</a>
		
		<a href="/admin/dashboard/comments" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors">
					<i class="fas fa-comment text-yellow-600 dark:text-yellow-400"></i>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">Duyệt bình luận</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">Quản lý bình luận</p>
				</div>
			</div>
		</a>
		
		<a href="/admin/dashboard/settings" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
					<i class="fas fa-cog text-purple-600 dark:text-purple-400"></i>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">Cài đặt</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">Cấu hình hệ thống</p>
				</div>
			</div>
		</a>
	</div>
	
	<!-- Recent Activity -->
	<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Hoạt động gần đây</h2>
		<div class="space-y-4">
			{#each recentActivity as activity}
				<div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
						<i class="fas {activity.icon || 'fa-bell'} text-blue-600 dark:text-blue-400"></i>
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-900 dark:text-white">{activity.title || activity.message}</p>
						<p class="text-xs text-gray-600 dark:text-gray-400">{activity.description || 'Hoạt động hệ thống'}</p>
					</div>
					<div class="text-xs text-gray-500 dark:text-gray-400">
						{activity.time || 'Vừa xong'}
					</div>
				</div>
			{:else}
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">
					<i class="fas fa-clock text-4xl mb-4 opacity-50"></i>
					<p>Chưa có hoạt động nào</p>
				</div>
			{/each}
		</div>
	</div>
</div>

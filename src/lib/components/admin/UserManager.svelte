<script>
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { writable } from 'svelte/store';

	const usersStore = writable([]);
	const loadingStore = writable(true);
	const searchQueryStore = writable('');
	const selectedRoleStore = writable('all');

	let users = usersStore;
	let loading = loadingStore;
	let searchQuery = searchQueryStore;
	let selectedRole = selectedRoleStore;

	const roles = [
		{ value: 'all', label: 'Tất cả' },
		{ value: 'admin', label: 'Quản trị viên' },
		{ value: 'user', label: 'Người dùng' }
	];

	const filteredUsers = derived(
		[users, searchQuery, selectedRole],
		([$users, $searchQuery, $selectedRole]) => {
			return $users.filter((user) => {
				const matchesSearch =
					user.name.toLowerCase().includes($searchQuery.toLowerCase()) ||
					user.email.toLowerCase().includes($searchQuery.toLowerCase());
				const matchesRole = $selectedRole === 'all' || user.role === $selectedRole;
				return matchesSearch && matchesRole;
			});
		}
	);

	$effect(() => {
		if ($loading) {
			loadUsers();
		}
	});

	async function loadUsers() {
		$loading = true;
		try {
			const response = await fetch('/api/admin/users');
			if (response.ok) {
				$users = await response.json();
			}
		} catch (error) {
			console.error('Error loading users:', error);
		} finally {
			$loading = false;
		}
	}

	async function updateUserRole(userId, newRole) {
		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ role: newRole })
			});

			if (response.ok) {
				await loadUsers();
			}
		} catch (error) {
			console.error('Error updating user role:', error);
		}
	}

	async function deleteUser(userId) {
		if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

		try {
			const response = await fetch(`/api/admin/users/${userId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await loadUsers();
			}
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h2 class="text-2xl font-bold text-gray-800 dark:text-white">Quản lý người dùng</h2>
	</div>

	<!-- Filters -->
	<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
		<div class="flex flex-col md:flex-row gap-4">
			<div class="flex-1">
				<input
					type="search"
					bind:value={$searchQuery}
					placeholder="Tìm kiếm người dùng..."
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			<div>
				<select
					bind:value={$selectedRole}
					class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				>
					{#each roles as role}
						<option value={role.value}>{role.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Users List -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
		{#if $loading}
			<div class="flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		{:else if $filteredUsers.length === 0}
			<div class="text-center py-12 text-gray-500 dark:text-gray-400">
				<i class="fas fa-users text-4xl mb-4 opacity-50"></i>
				<p>Không tìm thấy người dùng nào</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Người dùng
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Email
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Vai trò
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Ngày tạo
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
							>
								Thao tác
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-600">
						{#each $filteredUsers as user}
							<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
								<td class="px-6 py-4">
									<div class="flex items-center">
										<div
											class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4"
										>
											<i class="fas fa-user text-white"></i>
										</div>
										<div class="text-sm font-medium text-gray-900 dark:text-white">
											{user.name}
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
									{user.email}
								</td>
								<td class="px-6 py-4">
									<select
										value={user.role}
										onchange={(e) => updateUserRole(user.id, e.target.value)}
										class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
									>
										<option value="user">Người dùng</option>
										<option value="admin">Quản trị viên</option>
									</select>
								</td>
								<td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
									{new Date(user.createdAt).toLocaleDateString('vi-VN')}
								</td>
								<td class="px-6 py-4">
									<button
										onclick={() => deleteUser(user.id)}
										class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
										title="Xóa người dùng"
										aria-label="Xóa người dùng"
									>
										<i class="fas fa-trash"></i>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

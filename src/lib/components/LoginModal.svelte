<script>
	import { authStore } from '$lib/stores/auth.js';
	
	let { onClose } = $props();
	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);

	async function handleLogin(event) {
		event.preventDefault();
		isLoading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				const data = await response.json();
				authStore.login(data.token, data.user);
				onClose();
			} else {
				const error = await response.json();
				alert(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
			}
		} catch (error) {
			console.error('Login error:', error);
			alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" tabindex="-1" onkeydown={(e) => e.key === 'Escape' && onClose()} aria-label="Đăng nhập">
	<div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96 mx-4" aria-label="Đăng nhập form">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-2xl font-bold">Đăng nhập</h2>
			<button onclick={onClose} class="text-gray-500 hover:text-gray-700" aria-label="Đóng">
				<i class="fas fa-times"></i>
			</button>
		</div>
		
		<form onsubmit={handleLogin} class="space-y-4">
			<div>
				<label for="email" class="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
				<input 
					type="email" 
					id="email" 
					bind:value={email}
					required 
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			
			<div>
				<label for="password" class="block text-gray-700 dark:text-gray-300 mb-2">Mật khẩu</label>
				<input 
					type="password" 
					id="password" 
					bind:value={password}
					required
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			
			<div class="flex justify-between items-center pt-4">
				<button 
					type="submit" 
					disabled={isLoading}
					class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
				</button>
				<button 
					type="button" 
					onclick={onClose}
					class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
				>
					Đóng
				</button>
			</div>
		</form>
		
		<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
			<p>Tài khoản demo:</p>
			<p>Admin: admin@ttphcn-haiduong.vn / admin123</p>
			<p>User: user@example.com / user123</p>
		</div>
	</div>
</div>

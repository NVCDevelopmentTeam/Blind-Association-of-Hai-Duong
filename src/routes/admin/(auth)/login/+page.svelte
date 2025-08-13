<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let form = $state({
		email: '',
		password: '',
		rememberMe: false
	});

	let showPassword = $state(false);
	let loading = $state(false);
	let error = $state('');
	let validationErrors = $state({});

	onMount(() => {
		// Check if already logged in
		if (browser) {
			const token = localStorage.getItem('admin_token');
			if (token) {
				goto('/admin/dashboard');
			}
		}
	});

	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validatePassword(password) {
		const errors = [];

		if (password.length < 8) {
			errors.push('Mật khẩu phải có ít nhất 8 ký tự');
		}

		if (!/[A-Z]/.test(password)) {
			errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
		}

		if (!/[a-z]/.test(password)) {
			errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
		}

		if (!/[0-9]/.test(password)) {
			errors.push('Mật khẩu phải có ít nhất 1 số');
		}

		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt');
		}

		return errors;
	}

	function validateForm() {
		const errors = {};

		if (!form.email) {
			errors.email = 'Email là bắt buộc';
		} else if (!validateEmail(form.email)) {
			errors.email =
				'Email không hợp lệ. Vui lòng nhập đúng định dạng email có chứa ký tự @ (ví dụ: user@example.com)';
		}

		if (!form.password) {
			errors.password = 'Mật khẩu là bắt buộc';
		} else {
			const passwordErrors = validatePassword(form.password);
			if (passwordErrors.length > 0) {
				errors.password = passwordErrors.join('. ');
			}
		}

		validationErrors = errors;
		return Object.keys(errors).length === 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('http://localhost:3001/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form)
			});

			const data = await response.json();

			if (response.ok) {
				if (browser) {
					localStorage.setItem('admin_token', data.token);
					localStorage.setItem('admin_user', JSON.stringify(data.user));
					if (form.rememberMe) {
						localStorage.setItem('remember_admin', 'true');
					}
				}

				// Redirect to dashboard with 301 status
				goto('/admin/dashboard', { replaceState: true });
			} else {
				error = data.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'Lỗi kết nối server. Vui lòng thử lại sau.';
		} finally {
			loading = false;
		}
	}

	async function handleForgotPassword() {
		if (!form.email) {
			error = 'Vui lòng nhập email để khôi phục mật khẩu';
			return;
		}

		if (!validateEmail(form.email)) {
			error = 'Vui lòng nhập email hợp lệ có chứa ký tự @';
			return;
		}

		try {
			const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: form.email })
			});

			const data = await response.json();

			if (response.ok) {
				alert(data.message);
			} else {
				error = data.error;
			}
		} catch (err) {
			console.error('Forgot password error:', err);
			error = 'Lỗi kết nối. Vui lòng thử lại sau.';
		}
	}
</script>

<svelte:head>
	<title>Đăng nhập Quản trị - Trung tâm Phục hồi chức năng Hải Dương</title>
	<meta
		name="description"
		content="Đăng nhập vào hệ thống quản trị website Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương"
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<div class="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
				<i class="fas fa-shield-alt text-white text-2xl" aria-hidden="true"></i>
			</div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Đăng nhập Quản trị</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Trung tâm Phục hồi chức năng Hải Dương
			</p>
		</div>

		<!-- Login Form -->
		<form
			class="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
			onsubmit={handleSubmit}
		>
			{#if error}
				<div
					class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
					role="alert"
				>
					<div class="flex">
						<i class="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5" aria-hidden="true"></i>
						<div class="text-sm text-red-700 dark:text-red-400">
							{error}
						</div>
					</div>
				</div>
			{/if}

			<div class="space-y-4">
				<!-- Email Field -->
				<div>
					<label
						for="email"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Địa chỉ Email * (phải có ký tự @)
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<i class="fas fa-envelope text-gray-400" aria-hidden="true"></i>
						</div>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={form.email}
							class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 {validationErrors.email
								? 'border-red-500 focus:ring-red-500 focus:border-red-500'
								: ''}"
							placeholder="admin@ttphcn-haiduong.vn"
							aria-describedby={validationErrors.email ? 'email-error' : undefined}
						/>
					</div>
					{#if validationErrors.email}
						<p id="email-error" class="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
							<i class="fas fa-exclamation-triangle mr-1" aria-hidden="true"></i>
							{validationErrors.email}
						</p>
					{/if}
				</div>

				<!-- Password Field -->
				<div>
					<label
						for="password"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Mật khẩu * (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt)
					</label>
					<div class="relative">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<i class="fas fa-lock text-gray-400" aria-hidden="true"></i>
						</div>
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							required
							bind:value={form.password}
							class="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 {validationErrors.password
								? 'border-red-500 focus:ring-red-500 focus:border-red-500'
								: ''}"
							placeholder="Nhập mật khẩu"
							aria-describedby={validationErrors.password
								? 'password-error'
								: 'password-requirements'}
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={() => (showPassword = !showPassword)}
							aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
						>
							<i
								class="fas {showPassword
									? 'fa-eye-slash'
									: 'fa-eye'} text-gray-400 hover:text-gray-600"
								aria-hidden="true"
							></i>
						</button>
					</div>

					<div id="password-requirements" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
						Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
						(!@#$%^&*...)
					</div>

					{#if validationErrors.password}
						<p id="password-error" class="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
							<i class="fas fa-exclamation-triangle mr-1" aria-hidden="true"></i>
							{validationErrors.password}
						</p>
					{/if}
				</div>
			</div>

			<!-- Checkboxes -->
			<div class="space-y-3">
				<label class="flex items-center">
					<input
						type="checkbox"
						bind:checked={showPassword}
						class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
					/>
					<span class="ml-2 text-sm text-gray-700 dark:text-gray-300"> Hiển thị mật khẩu </span>
				</label>

				<label class="flex items-center">
					<input
						type="checkbox"
						bind:checked={form.rememberMe}
						class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
					/>
					<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
						Ghi nhớ đăng nhập trong trình duyệt
					</span>
				</label>
			</div>

			<!-- Buttons -->
			<div class="space-y-4">
				<button
					type="submit"
					disabled={loading}
					class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{#if loading}
						<i class="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
						Đang đăng nhập...
					{:else}
						<i class="fas fa-sign-in-alt mr-2" aria-hidden="true"></i>
						Đăng nhập
					{/if}
				</button>

				<button
					type="button"
					onclick={handleForgotPassword}
					class="w-full text-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
				>
					<i class="fas fa-key mr-1" aria-hidden="true"></i>
					Quên mật khẩu?
				</button>
			</div>

			<!-- Back to Home -->
			<div class="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
				<a
					href="/"
					class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
				>
					<i class="fas fa-arrow-left mr-1" aria-hidden="true"></i>
					Về trang chủ
				</a>
			</div>
		</form>

		<!-- Demo Credentials -->
		<div
			class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
		>
			<h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
				<i class="fas fa-info-circle mr-1" aria-hidden="true"></i>
				Tài khoản demo:
			</h3>
			<div class="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
				<p><strong>Email:</strong> admin@ttphcn-haiduong.vn</p>
				<p><strong>Mật khẩu:</strong> Admin123!</p>
			</div>
		</div>
	</div>
</div>

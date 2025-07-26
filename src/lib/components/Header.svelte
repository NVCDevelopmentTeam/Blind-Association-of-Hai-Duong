<script>
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.js';
	import SearchBox from './SearchBox.svelte';
	import LoginModal from './LoginModal.svelte';

	let showMobileMenu = $state(false);
	let showLoginModal = $state(false);
	let currentAuth = $state({ isAuthenticated: false, user: null });

	const navItems = [
		{ href: '/', label: 'Trang chủ' },
		{ href: '/gioi-thieu', label: 'Giới thiệu' },
		{ href: '/dao-tao', label: 'Đào tạo' },
		{ href: '/viec-lam', label: 'Việc làm' },
		{ href: '/hoat-dong', label: 'Hoạt động' },
		{ href: '/tin-tuc', label: 'Tin tức' },
		{ href: '/lien-he', label: 'Liên hệ' }
	];

	// Subscribe to auth store
	$effect(() => {
		const unsubscribe = authStore.subscribe(value => {
			currentAuth = value;
		});
		return unsubscribe;
	});

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}

	function handleLogin() {
		if (currentAuth.isAuthenticated) {
			authStore.logout();
		} else {
			showLoginModal = true;
		}
	}

	function closeLoginModal() {
		showLoginModal = false;
	}
</script>

<header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
	<nav id="navigation" class="content-wrapper flex justify-between items-center py-4" aria-label="Điều hướng chính">
		<div class="flex-1 flex justify-between items-center">
			<div class="logo flex items-center gap-4">
				<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 200 200" class="logo-svg">
					<title>Logo Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương</title>
					<circle cx="100" cy="100" r="90" fill="#1d4ed8"/>
					<circle cx="100" cy="100" r="70" fill="white"/>
					<path d="M100 40 C60 40 40 70 40 100 C40 130 60 160 100 160 C140 160 160 130 160 100 C160 70 140 40 100 40" fill="#1d4ed8"/>
					<circle cx="100" cy="100" r="30" fill="white"/>
					<text x="100" y="140" text-anchor="middle" fill="#1d4ed8" font-size="24" font-weight="bold">TTPHCN</text>
				</svg>
				<div class="hidden lg:block">
					<h1 class="text-xl font-bold text-gray-800 dark:text-white">
						Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương
					</h1>
				</div>
			</div>

			<div class="hidden lg:flex items-center gap-4">
				<SearchBox />
			</div>
			
			<div class="hidden lg:flex gap-6 items-center" role="menubar">
				{#each navItems as item}
					<a 
						href={item.href} 
						class="nav-link hover:text-blue-600 transition-colors"
						class:active={$page.url.pathname === item.href}
						role="menuitem"
					>
						{item.label}
					</a>
				{/each}
				
				<button 
					onclick={handleLogin}
					class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
				>
					{currentAuth.isAuthenticated ? 'Đăng xuất' : 'Đăng nhập'}
				</button>

				{#if currentAuth.isAuthenticated && currentAuth.user?.role === 'admin'}
					<a href="/admin" class="text-blue-600 hover:text-blue-800">
						<i class="fas fa-cog"></i> Admin
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<button 
				class="lg:hidden p-2"
				onclick={toggleMobileMenu}
				aria-expanded={showMobileMenu}
				aria-label="Toggle mobile menu"
			>
				<i class="fas fa-bars text-xl"></i>
			</button>
		</div>
	</nav>

	<!-- Mobile menu -->
	{#if showMobileMenu}
		<div class="lg:hidden bg-white dark:bg-gray-800 border-t">
			<div class="content-wrapper py-4">
				<SearchBox />
				<div class="mt-4 space-y-2">
					{#each navItems as item}
						<a 
							href={item.href} 
							class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
							onclick={() => showMobileMenu = false}
						>
							{item.label}
						</a>
					{/each}
					<button 
						onclick={handleLogin}
						class="w-full text-left py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						{currentAuth.isAuthenticated ? 'Đăng xuất' : 'Đăng nhập'}
					</button>
				</div>
			</div>
		</div>
	{/if}
</header>

{#if showLoginModal}
	<LoginModal onClose={closeLoginModal} />
{/if}

<style>
	.content-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.nav-link.active {
		color: #1d4ed8;
		font-weight: 600;
	}

	.logo-svg {
		flex-shrink: 0;
	}
</style>

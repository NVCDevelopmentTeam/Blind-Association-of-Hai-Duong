<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import AccessibilityControls from '$lib/components/AccessibilityControls.svelte';
	import LiveChat from '$lib/components/LiveChat.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { authStore } from '$lib/stores/auth.js';

	let { children } = $props();

	let theme = $state('light');
	let fontSize = $state(100);
	let highContrast = $state(false);

	onMount(() => {
		if (!browser) return;

		// Load user preferences
		const savedTheme = localStorage.getItem('theme') || 'light';
		const savedFontSize = localStorage.getItem('fontSize') || '100';
		const savedHighContrast = localStorage.getItem('highContrast') === 'true';
		
		theme = savedTheme;
		fontSize = parseInt(savedFontSize);
		highContrast = savedHighContrast;
		
		document.documentElement.setAttribute('data-theme', theme);
		document.body.style.fontSize = fontSize + '%';
		if (highContrast) document.body.classList.add('high-contrast');

		// Check auth status
		const token = localStorage.getItem('token');
		if (token) {
			authStore.login(token);
		}
	});

	function updateTheme(newTheme) {
		theme = newTheme;
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
			localStorage.setItem('theme', theme);
		}
	}

	function updateFontSize(newSize) {
		fontSize = newSize;
		if (browser) {
			document.body.style.fontSize = fontSize + '%';
			localStorage.setItem('fontSize', fontSize.toString());
		}
	}

	function updateHighContrast(enabled) {
		highContrast = enabled;
		if (browser) {
			if (enabled) {
				document.body.classList.add('high-contrast');
			} else {
				document.body.classList.remove('high-contrast');
			}
			localStorage.setItem('highContrast', enabled.toString());
		}
	}
</script>

<div class="skip-links">
	<a href="#main-content" class="skip-link">Bỏ qua phần nội dung chính</a>
	<a href="#navigation" class="skip-link">Bỏ qua điều hướng</a>
	<a href="#footer" class="skip-link">Bỏ qua chân trang</a>
</div>

<AccessibilityControls 
	{theme} 
	{fontSize} 
	{highContrast}
	{updateTheme}
	{updateFontSize}
	{updateHighContrast}
/>

<Header />

<main id="main-content" class="flex-1">
	{@render children()}
</main>

<Footer />
<LiveChat />
<BackToTop />

<style>
	.skip-links {
		position: absolute;
		top: -40px;
		left: 0;
		z-index: 100;
	}

	.skip-link {
		padding: 8px;
		background: var(--background-color);
		color: var(--link-color);
		transition: top 0.2s;
		text-decoration: none;
	}

	.skip-link:focus {
		top: 0;
	}
</style>

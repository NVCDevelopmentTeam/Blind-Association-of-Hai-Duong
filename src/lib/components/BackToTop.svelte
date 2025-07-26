<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	
	let showButton = $state(false);

	onMount(() => {
		if (!browser) return;

		function handleScroll() {
			showButton = window.pageYOffset > 300;
		}

		window.addEventListener('scroll', handleScroll);
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function scrollToTop() {
		if (browser) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	}
</script>

{#if showButton}
	<button 
		onclick={scrollToTop}
		class="back-to-top fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-40"
		aria-label="Về đầu trang"
	>
		<i class="fas fa-arrow-up"></i>
	</button>
{/if}

<style>
	.back-to-top {
		min-width: 48px;
		min-height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

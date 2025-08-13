<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		if (browser) {
			// Apply admin-specific styles
			document.body.classList.add('admin-layout');
		}

		return () => {
			if (browser) {
				document.body.classList.remove('admin-layout');
			}
		};
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
>
	{@render children?.()}
</div>

<style>
	:global(.admin-layout) {
		background: #f9fafb;
	}

	:global(.dark .admin-layout) {
		background: #111827;
	}
</style>

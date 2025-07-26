<script>
	import Hero from '$lib/components/Hero.svelte';
	import QuickLinks from '$lib/components/QuickLinks.svelte';
	import NewsSection from '$lib/components/NewsSection.svelte';
	import FeaturedContent from '$lib/components/FeaturedContent.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import UtilitiesSidebar from '$lib/components/UtilitiesSidebar.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { locale, _ } from 'svelte-i18n';

	let newsData = $state([]);
	let featuredData = $state([]);
	let loading = $state(true);

	onMount(async () => {
		if (!browser) return;
		
		try {
			// Track visitor
			await fetch('http://localhost:3001/api/track-visitor', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					page: '/',
					referrer: document.referrer
				})
			});

			// Fetch news data
			const newsResponse = await fetch('http://localhost:3001/api/posts?limit=6&status=PUBLISHED');
			if (newsResponse.ok) {
				const newsResult = await newsResponse.json();
				newsData = newsResult.posts || [];
			}

			// Fetch featured content
			const featuredResponse = await fetch('http://localhost:3001/api/posts?status=PUBLISHED&limit=4');
			if (featuredResponse.ok) {
				const featuredResult = await featuredResponse.json();
				featuredData = featuredResult.posts.filter(post => Math.random() > 0.5) || [];
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{$_('home.title')} - Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương</title>
	<meta name="description" content={$_('home.description')} />
	<meta property="og:title" content={$_('home.title')} />
	<meta property="og:description" content={$_('home.description')} />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://ttphcn-haiduong.vn/" />
</svelte:head>

<Hero />
<QuickLinks />

<div class="content-wrapper py-8">
	<div class="grid grid-cols-12 gap-8">
		<!-- Left Sidebar -->
		<aside class="col-span-12 lg:col-span-3">
			<Sidebar />
		</aside>
		
		<!-- Main Content Area -->
		<div class="col-span-12 lg:col-span-6">
			{#if loading}
				<div class="flex justify-center items-center py-12">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			{:else}
				<NewsSection {newsData} />
				<FeaturedContent {featuredData} />
			{/if}
		</div>
		
		<!-- Right Sidebar -->
		<aside class="col-span-12 lg:col-span-3">
			<UtilitiesSidebar />
		</aside>
	</div>
</div>

<style>
	.content-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}
</style>

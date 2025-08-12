<script>
  import Hero from '$lib/components/Hero.svelte';
  import QuickLinks from '$lib/components/QuickLinks.svelte';
  import NewsSection from '$lib/components/NewsSection.svelte';
  import FeaturedContent from '$lib/components/FeaturedContent.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let featuredPosts = $state([]);
  let loading = $state(true);

  onMount(async () => {
    if (browser) {
      try {
        const response = await fetch('/api/posts?limit=6&status=PUBLISHED');
        if (response.ok) {
          const data = await response.json();
          featuredPosts = data.posts || [];
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        loading = false;
      }
    }
  });
</script>

<svelte:head>
  <title>Trang chủ - Trung tâm Phục hồi chức năng Hải Dương</title>
  <meta name="description" content="Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương - Nơi hỗ trợ, đào tạo và tạo việc làm cho người khiếm thị" />
  <meta name="keywords" content="phục hồi chức năng, người khiếm thị, đào tạo nghề, việc làm, Hải Dương" />
</svelte:head>

<!-- Hero Section -->
<Hero />

<!-- Quick Links -->
<QuickLinks />

<!-- Main Content Area -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-12">
      <!-- Featured Content -->
      <FeaturedContent />
      
      <!-- Latest News -->
      <NewsSection {featuredPosts} {loading} />
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <Sidebar />
    </div>
  </div>
</div>

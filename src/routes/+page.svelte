<script>
  import Hero from '$lib/components/Hero.svelte';
  import QuickLinks from '$lib/components/QuickLinks.svelte';
  import NewsSection from '$lib/components/NewsSection.svelte';
  import FeaturedContent from '$lib/components/FeaturedContent.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import UtilitiesSidebar from '$lib/components/UtilitiesSidebar.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let featuredPosts = $state([]);
  let loading = $state(true);

  onMount(async () => {
    if (!browser) return;

    try {
      const response = await fetch('http://localhost:3001/api/posts?featured=true&limit=6');
      if (response.ok) {
        const result = await response.json();
        featuredPosts = result.posts || [];
      }
    } catch (error) {
      console.error('Error fetching featured posts:', error);
    } finally {
      loading = false;
    }
  });

  // SEO data
  export const data = {
    title: 'Trang chủ - Trung tâm Phục hồi chức năng Hải Dương',
    description: 'Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương - Nơi hỗ trợ, đào tạo và tạo việc làm cho người khiếm thị'
  };
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={data.description} />
  <meta property="og:title" content={data.title} />
  <meta property="og:description" content={data.description} />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- Hero Section -->
<Hero />

<!-- Quick Links -->
<QuickLinks />

<!-- Main Content Area -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-12">
      <!-- Featured Content -->
      <section aria-labelledby="featured-heading">
        <h2 id="featured-heading" class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Nội dung nổi bật
        </h2>
        <FeaturedContent posts={featuredPosts} {loading} />
      </section>

      <!-- Latest News -->
      <section aria-labelledby="news-heading">
        <h2 id="news-heading" class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Tin tức mới nhất
        </h2>
        <NewsSection />
      </section>
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-1">
      <Sidebar />
    </div>

    <!-- Utilities Sidebar -->
    <div class="lg:col-span-1">
      <UtilitiesSidebar />
    </div>
  </div>
</div>

<!-- Call to Action Section -->
<section class="bg-blue-600 dark:bg-blue-800 py-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-3xl font-bold text-white mb-4">
      Cần hỗ trợ hoặc tư vấn?
    </h2>
    <p class="text-xl text-blue-100 mb-8">
      Chúng tôi luôn sẵn sàng hỗ trợ bạn với đội ngũ chuyên viên giàu kinh nghiệm
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a 
        href="/lien-he"
        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
      >
        <i class="fas fa-phone mr-2" aria-hidden="true"></i>
        Liên hệ ngay
      </a>
      <a 
        href="/dao-tao"
        class="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
      >
        <i class="fas fa-graduation-cap mr-2" aria-hidden="true"></i>
        Xem khóa đào tạo
      </a>
    </div>
  </div>
</section>

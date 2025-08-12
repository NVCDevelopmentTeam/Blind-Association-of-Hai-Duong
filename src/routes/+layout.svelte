<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';
  import AccessibilityControls from '$lib/components/AccessibilityControls.svelte';
  import LiveChat from '$lib/components/LiveChat.svelte';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import '$lib/i18n';
  import { locale, _ } from 'svelte-i18n';
  import { derived } from 'svelte/store';

  let { children } = $props();

  const metaTitle = derived(page, ($page) => {
    return $page.data?.title || 'Trung tâm Phục hồi chức năng Hải Dương';
  });

  const metaDescription = derived(page, ($page) => {
    return $page.data?.description || 'Trung tâm hỗ trợ phục hồi chức năng, đào tạo nghề và tạo việc làm cho người khiếm thị tại Hải Dương';
  });

  onMount(() => {
    if (browser) {
      // Auto-detect language based on location/browser
      const userLang = navigator.language.split('-')[0];
      const supportedLangs = ['vi', 'en'];
      
      if (supportedLangs.includes(userLang)) {
        locale.set(userLang);
      } else {
        locale.set('vi'); // Default to Vietnamese
      }

      // Track page views
      const trackPageView = async () => {
        try {
          await fetch('/api/track-visitor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              page: $page.url.pathname,
              referrer: document.referrer || ''
            })
          });
        } catch (error) {
          console.error('Error tracking page view:', error);
        }
      };

      trackPageView();
    }
  });
</script>

<svelte:head>
  <title>{$metaTitle}</title>
  <meta name="description" content={$metaDescription} />
  <meta property="og:title" content={$metaTitle} />
  <meta property="og:description" content={$metaDescription} />
  <meta property="og:url" content={$page.url.href} />
  <link rel="canonical" href={$page.url.href} />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Skip to main content link for screen readers -->
  <a href="#main-content" class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary-600 text-white p-2 z-50">
    Chuyển đến nội dung chính
  </a>

  <!-- Accessibility Controls -->
  <AccessibilityControls />

  <!-- Header -->
  <Header />

  <!-- Main Content -->
  <main id="main-content" class="flex-1" role="main">
    {@html children()}
  </main>

  <!-- Footer -->
  <Footer />

  <!-- Back to Top Button -->
  <BackToTop />

  <!-- Live Chat -->
  <LiveChat />
</div>

<!-- Structured Data for SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương",
  "url": "https://ttphcn-haiduong.vn",
  "logo": "https://ttphcn-haiduong.vn/logo.png",
  "description": "Trung tâm hỗ trợ phục hồi chức năng, đào tạo nghề và tạo việc làm cho người khiếm thị tại Hải Dương",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Hải Dương",
    "addressCountry": "VN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-123-456-789",
    "contactType": "customer service",
    "email": "info@ttphcn-haiduong.vn"
  },
  "sameAs": [
    "https://facebook.com/ttphcn-haiduong",
    "https://youtube.com/ttphcn-haiduong"
  ]
}
</script>

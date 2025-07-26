<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { locale, _ } from 'svelte-i18n';
  import SearchBox from './SearchBox.svelte';
  import TextToSpeech from './TextToSpeech.svelte';

  let mobileMenuOpen = $state(false);
  let currentLocale = $state('vi');
  let darkMode = $state(false);

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: 'fa-home' },
    { name: 'Giới thiệu', href: '/gioi-thieu', icon: 'fa-info-circle' },
    { name: 'Đào tạo', href: '/dao-tao', icon: 'fa-graduation-cap' },
    { name: 'Việc làm', href: '/viec-lam', icon: 'fa-briefcase' },
    { name: 'Hoạt động', href: '/hoat-dong', icon: 'fa-calendar-alt' },
    { name: 'Tin tức', href: '/tin-tuc', icon: 'fa-newspaper' },
    { name: 'Liên hệ', href: '/lien-he', icon: 'fa-phone' }
  ];

  onMount(() => {
    if (browser) {
      // Load saved preferences
      const savedLocale = localStorage.getItem('locale') || 'vi';
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      
      currentLocale = savedLocale;
      darkMode = savedDarkMode;
      
      locale.set(savedLocale);
      
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function changeLanguage(newLocale) {
    currentLocale = newLocale;
    locale.set(newLocale);
    if (browser) {
      localStorage.setItem('locale', newLocale);
    }
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
    if (browser) {
      localStorage.setItem('darkMode', darkMode.toString());
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  function isActive(href) {
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  }
</script>

<header class="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40" aria-labelledby="header-label">
  <!-- Top Bar -->
  <div class="bg-blue-600 dark:bg-blue-800 text-white py-2">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center text-sm">
        <div class="flex items-center space-x-4">
          <a href="tel:+84123456789" class="hover:text-blue-200 transition-colors">
            <i class="fas fa-phone mr-1" aria-hidden="true"></i>
            +84 123 456 789
          </a>
          <a href="mailto:info@ttphcn-haiduong.vn" class="hover:text-blue-200 transition-colors">
            <i class="fas fa-envelope mr-1" aria-hidden="true"></i>
            info@ttphcn-haiduong.vn
          </a>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <div class="relative group">
            <button 
              class="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              aria-label="Chọn ngôn ngữ"
            >
              <i class="fas fa-globe" aria-hidden="true"></i>
              <span>{currentLocale.toUpperCase()}</span>
            </button>
            <div class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button 
                onclick={() => changeLanguage('vi')}
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                Tiếng Việt
              </button>
              <button 
                onclick={() => changeLanguage('en')}
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              >
                English
              </button>
            </div>
          </div>

          <!-- Dark Mode Toggle -->
          <button 
            onclick={toggleDarkMode}
            class="hover:text-blue-200 transition-colors"
            aria-label={darkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            <i class="fas {darkMode ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>
          </button>

          <!-- Social Links -->
          <div class="flex items-center space-x-2">
            <a href="https://facebook.com" class="hover:text-blue-200 transition-colors" aria-label="Facebook">
              <i class="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a href="https://youtube.com" class="hover:text-blue-200 transition-colors" aria-label="YouTube">
              <i class="fab fa-youtube" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Header -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <i class="fas fa-eye text-white text-xl" aria-hidden="true"></i>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              TTPHCN Hải Dương
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Trung tâm Phục hồi chức năng
            </p>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center space-x-8" aria-label="Điều hướng chính">
        {#each navigation as item}
          <a 
            href={item.href}
            class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive(item.href) ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'}"
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <i class="fas {item.icon}" aria-hidden="true"></i>
            <span>{item.name}</span>
          </a>
        {/each}
      </nav>

      <!-- Search and Utilities -->
      <div class="flex items-center space-x-4">
        <SearchBox />
        <TextToSpeech />
        
        <!-- Mobile menu button -->
        <button 
          onclick={toggleMobileMenu}
          class="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label="Mở menu điều hướng"
        >
          <i class="fas {mobileMenuOpen ? 'fa-times' : 'fa-bars'}" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Navigation -->
  {#if mobileMenuOpen}
    <div class="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <nav class="px-4 py-4 space-y-2" aria-label="Điều hướng di động">
        {#each navigation as item}
          <a 
            href={item.href}
            onclick={() => mobileMenuOpen = false}
            class="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors {isActive(item.href) ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'}"
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <i class="fas {item.icon}" aria-hidden="true"></i>
            <span>{item.name}</span>
          </a>
        {/each}
      </nav>
    </div>
  {/if}
</header>

<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let showControls = false;
  let fontSize = 16;
  let highContrast = false;
  let reducedMotion = false;

  onMount(() => {
    if (browser) {
      // Load saved preferences
      fontSize = parseInt(localStorage.getItem('fontSize') || '16');
      highContrast = localStorage.getItem('highContrast') === 'true';
      reducedMotion = localStorage.getItem('reducedMotion') === 'true';

      applySettings();

      // Check for system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        reducedMotion = true;
        applySettings();
      }
    }
  });

  function toggleControls() {
    showControls = !showControls;
  }

  function changeFontSize(delta) {
    fontSize = Math.max(12, Math.min(24, fontSize + delta));
    applySettings();
    saveSettings();
  }

  function toggleHighContrast() {
    highContrast = !highContrast;
    applySettings();
    saveSettings();
  }

  function toggleReducedMotion() {
    reducedMotion = !reducedMotion;
    applySettings();
    saveSettings();
  }

  function applySettings() {
    if (!browser) return;

    document.documentElement.style.fontSize = fontSize + 'px';
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }

  function saveSettings() {
    if (!browser) return;

    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('reducedMotion', reducedMotion.toString());
  }

  function resetSettings() {
    fontSize = 16;
    highContrast = false;
    reducedMotion = false;
    
    applySettings();
    
    if (browser) {
      localStorage.removeItem('fontSize');
      localStorage.removeItem('highContrast');
      localStorage.removeItem('reducedMotion');
    }
  }
</script>

<!-- Accessibility Controls Toggle -->
<button 
  onclick={toggleControls}
  class="fixed top-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
  aria-label="Mở điều khiển truy cập"
  aria-expanded={showControls}
>
  <i class="fas fa-universal-access" aria-hidden="true"></i>
</button>

<!-- Accessibility Controls Panel -->
{#if showControls}
  <div class="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 w-80 max-w-[calc(100vw-2rem)]">
    <div class="flex items-center justify-between mb-4">
      <label for="accessibility-controls" class="text-lg font-bold text-gray-900 dark:text-white">
        Điều khiển truy cập
      </label>
      <button 
        onclick={toggleControls}
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Đóng điều khiển truy cập"
      >
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Font Size Control -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Kích thước chữ: {fontSize}px
      </label>
      <div class="flex items-center space-x-2">
        <button 
          onclick={() => changeFontSize(-2)}
          class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Giảm kích thước chữ"
        >
          <i class="fas fa-minus" aria-hidden="true"></i>
        </button>
        <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style="width: {((fontSize - 12) / 12) * 100}%"
          ></div>
        </div>
        <button 
          onclick={() => changeFontSize(2)}
          class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Tăng kích thước chữ"
        >
          <i class="fas fa-plus" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- High Contrast Toggle -->
    <div class="mb-4">
      <label class="flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          bind:checked={highContrast}
          on:change={toggleHighContrast}
          class="sr-only"
        />
        <div class="relative">
          <div class="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full shadow-inner transition-colors {highContrast ? 'bg-purple-600' : ''}"></div>
          <div class="absolute w-4 h-4 bg-white rounded-full shadow top-1 transition-transform {highContrast ? 'translate-x-5' : 'translate-x-1'}"></div>
        </div>
        <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">
          Chế độ tương phản cao
        </span>
      </label>
    </div>

    <!-- Reduced Motion Toggle -->
    <div class="mb-4">
      <label class="flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          bind:checked={reducedMotion}
          on:change={toggleReducedMotion}
          class="sr-only"
        />
        <div class="relative">
          <div class="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full shadow-inner transition-colors {reducedMotion ? 'bg-purple-600' : ''}"></div>
          <div class="absolute w-4 h-4 bg-white rounded-full shadow top-1 transition-transform {reducedMotion ? 'translate-x-5' : 'translate-x-1'}"></div>
        </div>
        <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">
          Giảm hiệu ứng chuyển động
        </span>
      </label>
    </div>

    <!-- Reset Button -->
    <button 
      onclick={resetSettings}
      class="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      <i class="fas fa-undo mr-2" aria-hidden="true"></i>
      Đặt lại cài đặt
    </button>
  </div>
{/if}

<!-- Click outside to close -->
{#if showControls}
  <div 
    class="fixed inset-0 z-40" 
    onclick={toggleControls}
    aria-hidden="true"
  ></div>
{/if}

<style>
  :global(.high-contrast) {
    filter: contrast(150%) brightness(120%);
  }
  
  :global(.reduce-motion *) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
</style>

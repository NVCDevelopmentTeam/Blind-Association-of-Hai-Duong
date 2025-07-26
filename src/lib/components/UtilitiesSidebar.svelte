<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let fontSize = $state(100);
  let highContrast = $state(false);
  let darkMode = $state(false);

  onMount(() => {
    if (browser) {
      // Load saved preferences
      fontSize = parseInt(localStorage.getItem('fontSize') || '100');
      highContrast = localStorage.getItem('highContrast') === 'true';
      darkMode = localStorage.getItem('darkMode') === 'true';

      // Apply settings
      document.body.style.fontSize = fontSize + '%';
      if (highContrast) {
        document.body.classList.add('high-contrast');
      }
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  });

  function adjustFontSize(change) {
    fontSize = Math.max(80, Math.min(150, fontSize + change));
    if (browser) {
      document.body.style.fontSize = fontSize + '%';
      localStorage.setItem('fontSize', fontSize.toString());
    }
  }

  function toggleHighContrast() {
    highContrast = !highContrast;
    if (browser) {
      if (highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      localStorage.setItem('highContrast', highContrast.toString());
    }
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
    if (browser) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }

  function resetSettings() {
    fontSize = 100;
    highContrast = false;
    darkMode = false;
    
    if (browser) {
      document.body.style.fontSize = '100%';
      document.body.classList.remove('high-contrast');
      document.documentElement.classList.remove('dark');
      
      localStorage.setItem('fontSize', '100');
      localStorage.setItem('highContrast', 'false');
      localStorage.setItem('darkMode', 'false');
    }
  }
</script>

<aside class="space-y-8" aria-label="Tiện ích hỗ trợ">
  <!-- Accessibility Controls -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <i class="fas fa-universal-access text-purple-600 mr-2" aria-hidden="true"></i>
      Hỗ trợ truy cập
    </h3>
    
    <div class="space-y-4">
      <!-- Font Size Control -->
      <div>
        <label for="fontSizeControl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Kích thước chữ: {fontSize}%
        </label>
        <div class="flex items-center space-x-2">
          <button 
            onclick={() => adjustFontSize(-10)}
            class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Giảm kích thước chữ"
          >
            <i class="fas fa-minus" aria-hidden="true"></i>
          </button>
          <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style="width: {((fontSize - 80) / 70) * 100}%"
            ></div>
          </div>
          <button 
            onclick={() => adjustFontSize(10)}
            class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Tăng kích thước chữ"
          >
            <i class="fas fa-plus" aria-hidden="true"></i>
          </button>
        </div>
        <input type="hidden" id="fontSizeControl" />
      </div>

      <!-- High Contrast Toggle -->
      <div class="flex items-center justify-between">
        <label for="highContrastToggle" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Độ tương phản cao
        </label>
        <button 
          id="highContrastToggle"
          onclick={toggleHighContrast}
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}"
          aria-pressed={highContrast}
          aria-label="Bật/tắt độ tương phản cao"
        >
          <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {highContrast ? 'translate-x-6' : 'translate-x-1'}"></span>
        </button>
      </div>

      <!-- Dark Mode Toggle -->
      <div class="flex items-center justify-between">
        <label for="darkModeToggle" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Chế độ tối
        </label>
        <button 
          id="darkModeToggle"
          onclick={toggleDarkMode}
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}"
          aria-pressed={darkMode}
          aria-label="Bật/tắt chế độ tối"
        >
          <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {darkMode ? 'translate-x-6' : 'translate-x-1'}"></span>
        </button>
      </div>

      <!-- Reset Button -->
      <button 
        onclick={resetSettings}
        class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
      >
        <i class="fas fa-undo mr-2" aria-hidden="true"></i>
        Đặt lại mặc định
      </button>
    </div>
  </div>

  <!-- Quick Tools -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <i class="fas fa-tools text-orange-600 mr-2" aria-hidden="true"></i>
      Công cụ hỗ trợ
    </h3>
    
    <div class="space-y-3">
      <a 
        href="/tim-kiem"
        class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
      >
        <i class="fas fa-search text-blue-600 mr-3" aria-hidden="true"></i>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Tìm kiếm nâng cao
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Tìm kiếm thông tin chi tiết
          </div>
        </div>
      </a>

      <a 
        href="/ban-do"
        class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
      >
        <i class="fas fa-map-marked-alt text-green-600 mr-3" aria-hidden="true"></i>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Bản đồ trung tâm
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Xem vị trí và đường đi
          </div>
        </div>
      </a>

      <a 
        href="/tai-lieu"
        class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
      >
        <i class="fas fa-download text-purple-600 mr-3" aria-hidden="true"></i>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Tải tài liệu
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Brochure và hướng dẫn
          </div>
        </div>
      </a>

      <a 
        href="/lien-he"
        class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
      >
        <i class="fas fa-headset text-red-600 mr-3" aria-hidden="true"></i>
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Hỗ trợ trực tuyến
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Chat với chuyên viên
          </div>
        </div>
      </a>
    </div>
  </div>

  <!-- Emergency Contact -->
  <div class="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6">
    <h3 class="text-lg font-bold text-red-900 dark:text-red-100 mb-4 flex items-center">
      <i class="fas fa-exclamation-triangle text-red-600 mr-2" aria-hidden="true"></i>
      Liên hệ khẩn cấp
    </h3>
    
    <div class="space-y-3 text-sm">
      <div class="flex items-center">
        <i class="fas fa-phone text-red-600 mr-3" aria-hidden="true"></i>
        <a href="tel:+84123456789" class="text-red-700 dark:text-red-300 hover:underline font-medium">
          +84 123 456 789
        </a>
      </div>
      <div class="flex items-center">
        <i class="fas fa-ambulance text-red-600 mr-3" aria-hidden="true"></i>
        <a href="tel:115" class="text-red-700 dark:text-red-300 hover:underline font-medium">
          115 (Cấp cứu)
        </a>
      </div>
      <div class="flex items-center">
        <i class="fas fa-fire text-red-600 mr-3" aria-hidden="true"></i>
        <a href="tel:114" class="text-red-700 dark:text-red-300 hover:underline font-medium">
          114 (Cứu hỏa)
        </a>
      </div>
    </div>
  </div>
</aside>

<script>
  import { browser } from '$app/environment';
  
  let { url, title, description } = $props();
  let showDropdown = $state(false);
  
  function toggleDropdown() {
    showDropdown = !showDropdown;
  }
  
  function closeDropdown() {
    showDropdown = false;
  }
  
  function shareToFacebook() {
    if (browser) {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + url)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    closeDropdown();
  }
  
  function shareToTwitter() {
    if (browser) {
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + url)}&text=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    closeDropdown();
  }
  
  function shareToLinkedIn() {
    if (browser) {
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + url)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    closeDropdown();
  }
  
  function copyToClipboard() {
    if (browser) {
      const fullUrl = window.location.origin + url;
      navigator.clipboard.writeText(fullUrl).then(() => {
        alert('Đã sao chép liên kết!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Đã sao chép liên kết!');
      });
    }
    closeDropdown();
  }
  
  function shareViaEmail() {
    if (browser) {
      const subject = encodeURIComponent(title);
      const body = encodeURIComponent(`${description}\n\nXem thêm: ${window.location.origin + url}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
    closeDropdown();
  }
</script>

<div class="relative">
  <button 
    onclick={toggleDropdown}
    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
    aria-label="Chia sẻ bài viết"
    aria-expanded={showDropdown}
  >
    <i class="fas fa-share-alt" aria-hidden="true"></i>
  </button>
  
  {#if showDropdown}
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 z-10" 
      onclick={closeDropdown}
      aria-hidden="true"
    ></div>
    
    <!-- Dropdown Menu -->
    <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
      <div class="py-1">
        <button 
          onclick={shareToFacebook}
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i class="fab fa-facebook-f text-blue-600 mr-3" aria-hidden="true"></i>
          Facebook
        </button>
        
        <button 
          onclick={shareToTwitter}
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i class="fab fa-twitter text-blue-400 mr-3" aria-hidden="true"></i>
          Twitter
        </button>
        
        <button 
          onclick={shareToLinkedIn}
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i class="fab fa-linkedin-in text-blue-700 mr-3" aria-hidden="true"></i>
          LinkedIn
        </button>
        
        <button 
          onclick={shareViaEmail}
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i class="fas fa-envelope text-gray-600 mr-3" aria-hidden="true"></i>
          Email
        </button>
        
        <hr class="my-1 border-gray-200 dark:border-gray-600" />
        
        <button 
          onclick={copyToClipboard}
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <i class="fas fa-copy text-gray-600 mr-3" aria-hidden="true"></i>
          Sao chép liên kết
        </button>
      </div>
    </div>
  {/if}
</div>

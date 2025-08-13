<!-- @migration-task Error while migrating Svelte code: Expected token >
https://svelte.dev/e/expected_token -->
<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const state = writable('');
  let searchQuery = ''; // Initialize as a variable instead of a constant
  const searchResults = writable([]);
  const showResults = writable(false);
  const loading = writable(false);
  let searchTimeout = null;
  let recognition = null;

  // Initialize speech recognition if available
  function initRecognition() {
    if (browser && 'webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'vi-VN';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        state.set(transcript);
        handleSearch();
      };
      
      recognition.onend = () => {
        state.update(isListening => false);
      };
      
      recognition.onerror = () => {
        state.update(isListening => false);
        alert('Có lỗi xảy ra với tính năng nhận dạng giọng nói. Vui lòng thử lại.');
      };
    }
  }

  // Initialize on mount
  onMount(() => {
    if (browser) {
      initRecognition();
      // Add keyboard shortcut for search (Ctrl/Cmd + K)
      function handleKeydown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          document.getElementById('search-input')?.focus();
        }
      }

      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }
  });

  async function performSearch(query) {
    if (!query.trim()) {
      searchResults.set([]);
      showResults.set(false);
      return;
    }

    loading.set(true);
    
    try {
      const response = await fetch(`http://localhost:3001/api/posts?search=${encodeURIComponent(query)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        searchResults.set(data.posts || []);
        showResults.set(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      searchResults.set([]);
    } finally {
      loading.set(false);
    }
  }

  function handleInput() {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
      performSearch(state.get());
    }, 300);
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchQuery = state.get(); // Update searchQuery variable
    if (searchQuery.trim()) {
      goto(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
      showResults.set(false);
    }
  }

  function selectResult(result) {
    goto(`/tin-tuc/${result.slug}`);
    showResults.set(false);
    state.set('');
  }

  function closeResults() {
    setTimeout(() => {
      showResults.set(false);
    }, 200);
  }

  const isListening = writable(false);

  function startVoiceSearch() {
    if (recognition) {
      isListening.set(true);
      recognition.start();
    }
  }

  function handleSearch() {
    performSearch(state.get());
  }

  state.subscribe(value => {
    searchQuery = value; // Update searchQuery variable on state change
  });
</script>

<div class="search-container relative flex-1 max-w-md">
  <form onsubmit={handleSubmit} class="relative">
    <div class="relative">
      <input 
        id="search-input"
        type="search" 
        value={searchQuery} // Bind to the variable instead of the store
        oninput={(event) => state.set(event.target.value)} // Update state on input change
        onblur={closeResults}
        placeholder="Tìm kiếm... (Ctrl+K)"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        aria-label="Tìm kiếm"
        autocomplete="off" />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {#if $loading}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
        {:else}
          <i class="fas fa-search text-gray-400" aria-hidden="true"></i>
        {/if}
      </div>
    </div>
    
    <button 
      type="submit" 
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      aria-label="Tìm kiếm"
    >
      <i class="fas fa-search"></i>
    </button>
    
    {#if recognition}
      <button 
        type="button"
        onclick={startVoiceSearch}
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        class:animate-pulse={$isListening}
        aria-label="Tìm kiếm bằng giọng nói"
      >
        <i class="fas fa-microphone"></i>
      </button>
    {/if}
  </form>

  <!-- Search Results Dropdown -->
  {#if $showResults && $searchResults.length > 0}
    <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
      <div class="p-2">
        <div class="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          Kết quả tìm kiếm cho "{searchQuery}" <!-- Use the variable instead of the store -->
        </div>
        {#each $searchResults as result}
          <button 
            onclick={() => selectResult(result)}
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
          >
            <div class="flex items-start space-x-3">
              {#if result.featuredImage}
                <img 
                  src={result.featuredImage || "/placeholder.svg"} 
                  alt={result.title}
                  class="w-12 h-12 object-cover rounded-md flex-shrink-0"
                />
              {:else}
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-file-alt text-gray-400" aria-hidden="true"></i>
                </div>
              {/if}
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                  {result.title}
                </h4>
                {#if result.excerpt}
                  <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {result.excerpt}
                  </p>
                {/if}
                <div class="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{result.author.name}</span>
                  <span class="mx-1">•</span>
                  <time datetime={result.publishedAt}>
                    {new Date(result.publishedAt).toLocaleDateString('vi-VN')}
                  </time>
                </div>
              </div>
            </div>
          </button>
        {/each}
        <div class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          <button 
            onclick={() => goto(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`)} <!-- Use the variable instead of the store -->
            class="w-full text-left p-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Xem tất cả kết quả cho "{searchQuery}" <!-- Use the variable instead of the store -->
            <i class="fas fa-arrow-right ml-2" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  {:else if $showResults && searchQuery.trim() && !$loading} <!-- Use the variable instead of the store -->
    <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div class="p-4 text-center text-gray-500 dark:text-gray-400">
        <i class="fas fa-search text-2xl mb-2" aria-hidden="true"></i>
        <p>Không tìm thấy kết quả nào cho "{searchQuery}" <!-- Use the variable instead of the store --></p>
      </div>
    </div>
  {/if}
</div>

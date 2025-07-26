<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let searchQuery = $state('');
	let searchResults = $state([]);
	let showResults = $state(false);
	let isListening = $state(false);
	let recognition = $state(null);
	
	// Initialize speech recognition if available
	function initRecognition() {
		if (browser && 'webkitSpeechRecognition' in window) {
			recognition = new window.webkitSpeechRecognition();
			recognition.continuous = false;
			recognition.lang = 'vi-VN';
			
			recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				searchQuery = transcript;
				handleSearch();
			};
			
			recognition.onend = () => {
				isListening = false;
			};
			
			recognition.onerror = () => {
				isListening = false;
				alert('Có lỗi xảy ra với tính năng nhận dạng giọng nói. Vui lòng thử lại.');
			};
		}
	}

	// Initialize on mount
	if (browser) {
		initRecognition();
	}

	async function handleSearch(event) {
		if (event) event.preventDefault();
		
		if (!searchQuery.trim()) return;
		
		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
			const results = await response.json();
			searchResults = results;
			showResults = true;
		} catch (error) {
			console.error('Search error:', error);
			alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
		}
	}

	function startVoiceSearch() {
		if (recognition) {
			isListening = true;
			recognition.start();
		}
	}

	function hideResults() {
		setTimeout(() => {
			showResults = false;
		}, 200);
	}

	function selectResult(result) {
		showResults = false;
		goto(result.url);
	}
</script>

<div class="search-container relative flex-1 max-w-md">
	<form onsubmit={handleSearch} class="flex items-center gap-2">
		<div class="relative flex-1">
			<input 
				type="search" 
				bind:value={searchQuery}
				onblur={hideResults}
				onfocus={() => searchResults.length > 0 && (showResults = true)}
				class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				placeholder="Tìm kiếm..."
				aria-label="Tìm kiếm"
			/>
			
			{#if showResults && searchResults.length > 0}
				<div class="search-results absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
					{#each searchResults as result}
						<button 
							class="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
							onclick={() => selectResult(result)}
						>
							<h4 class="font-medium text-gray-900 dark:text-white">{result.title}</h4>
							<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{result.excerpt}</p>
						</button>
					{/each}
				</div>
			{/if}
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
				class:animate-pulse={isListening}
				aria-label="Tìm kiếm bằng giọng nói"
			>
				<i class="fas fa-microphone"></i>
			</button>
		{/if}
	</form>
</div>

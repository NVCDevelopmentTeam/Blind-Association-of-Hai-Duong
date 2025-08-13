<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let isSupported = $state(false);
	let isPlaying = $state(false);
	let isPaused = $state(false);
	let voices = $state([]);
	let selectedVoice = $state(null);
	let rate = $state(1);
	let pitch = $state(1);
	let volume = $state(1);
	let showControls = $state(false);

	onMount(() => {
		if (browser && 'speechSynthesis' in window) {
			isSupported = true;
			loadVoices();

			// Load voices when they become available
			speechSynthesis.onvoiceschanged = loadVoices;
		}
	});

	function loadVoices() {
		voices = speechSynthesis.getVoices();
		// Prefer Vietnamese voices
		selectedVoice = voices.find((voice) => voice.lang.startsWith('vi')) || voices[0];
	}

	function speakText(text) {
		if (!isSupported || !text) return;

		// Stop any current speech
		speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);

		if (selectedVoice) {
			utterance.voice = selectedVoice;
		}

		utterance.rate = rate;
		utterance.pitch = pitch;
		utterance.volume = volume;

		utterance.onstart = () => {
			isPlaying = true;
			isPaused = false;
		};

		utterance.onend = () => {
			isPlaying = false;
			isPaused = false;
		};

		utterance.onerror = () => {
			isPlaying = false;
			isPaused = false;
		};

		speechSynthesis.speak(utterance);
	}

	function speakPage() {
		const mainContent = document.querySelector('main');
		if (mainContent) {
			const text = mainContent.innerText;
			speakText(text);
		}
	}

	function speakSelection() {
		const selection = window.getSelection();
		if (selection && selection.toString().trim()) {
			speakText(selection.toString());
		} else {
			alert('Vui lòng chọn văn bản để đọc');
		}
	}

	function pauseResume() {
		if (isPaused) {
			speechSynthesis.resume();
			isPaused = false;
		} else {
			speechSynthesis.pause();
			isPaused = true;
		}
	}

	function stop() {
		speechSynthesis.cancel();
		isPlaying = false;
		isPaused = false;
	}

	function toggleControls() {
		showControls = !showControls;
	}
</script>

{#if isSupported}
	<div class="relative">
		<button
			onclick={toggleControls}
			class="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
			aria-label="Điều khiển đọc văn bản"
			title="Đọc văn bản (Text-to-Speech)"
		>
			<i class="fas {isPlaying ? 'fa-volume-up' : 'fa-volume-off'}" aria-hidden="true"></i>
		</button>

		{#if showControls}
			<div
				class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4"
			>
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Đọc văn bản</h3>
					<button
						onclick={toggleControls}
						class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						aria-label="Đóng điều khiển"
					>
						<i class="fas fa-times" aria-hidden="true"></i>
					</button>
				</div>

				<!-- Quick Actions -->
				<div class="grid grid-cols-2 gap-2 mb-4">
					<button
						onclick={speakPage}
						class="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm"
					>
						<i class="fas fa-file-alt mr-2" aria-hidden="true"></i>
						Đọc trang
					</button>
					<button
						onclick={speakSelection}
						class="p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-sm"
					>
						<i class="fas fa-text-height mr-2" aria-hidden="true"></i>
						Đọc lựa chọn
					</button>
				</div>

				<!-- Playback Controls -->
				{#if isPlaying}
					<div class="flex items-center justify-center space-x-2 mb-4">
						<button
							onclick={pauseResume}
							class="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
							aria-label={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
						>
							<i class="fas {isPaused ? 'fa-play' : 'fa-pause'}" aria-hidden="true"></i>
						</button>
						<button
							onclick={stop}
							class="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
							aria-label="Dừng"
						>
							<i class="fas fa-stop" aria-hidden="true"></i>
						</button>
					</div>
				{/if}

				<!-- Voice Selection -->
				{#if voices.length > 0}
					<div class="mb-4">
						<label
							for="voice-select"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Giọng đọc:
						</label>
						<select
							id="voice-select"
							bind:value={selectedVoice}
							class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
						>
							{#each voices as voice}
								<option value={voice}>
									{voice.name} ({voice.lang})
								</option>
							{/each}
						</select>
					</div>
				{/if}

				<!-- Speed Control -->
				<div class="mb-4">
					<label
						for="rate-control"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Tốc độ: {rate}x
					</label>
					<input
						id="rate-control"
						type="range"
						bind:value={rate}
						min="0.5"
						max="2"
						step="0.1"
						class="w-full"
					/>
				</div>

				<!-- Pitch Control -->
				<div class="mb-4">
					<label
						for="pitch-control"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Cao độ: {pitch}
					</label>
					<input
						id="pitch-control"
						type="range"
						bind:value={pitch}
						min="0"
						max="2"
						step="0.1"
						class="w-full"
					/>
				</div>

				<!-- Volume Control -->
				<div class="mb-4">
					<label
						for="volume-control"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
					>
						Âm lượng: {Math.round(volume * 100)}%
					</label>
					<input
						id="volume-control"
						type="range"
						bind:value={volume}
						min="0"
						max="1"
						step="0.1"
						class="w-full"
					/>
				</div>

				<!-- Instructions -->
				<div
					class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
				>
					<p class="mb-1"><strong>Hướng dẫn:</strong></p>
					<ul class="space-y-1">
						<li>• Chọn văn bản và nhấn "Đọc lựa chọn"</li>
						<li>• Nhấn "Đọc trang" để đọc toàn bộ nội dung</li>
						<li>• Điều chỉnh tốc độ, cao độ và âm lượng theo ý muốn</li>
					</ul>
				</div>
			</div>
		{/if}
	</div>

	<!-- Click outside to close -->
	{#if showControls}
		<div class="fixed inset-0 z-40" onclick={toggleControls} aria-hidden="true"></div>
	{/if}
{/if}

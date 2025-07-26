<script>
	import { browser } from '$app/environment';
	
	let { text } = $props();
	let isPlaying = $state(false);
	let utterance = $state(null);

	function toggleSpeech() {
		if (!browser || !('speechSynthesis' in window)) {
			alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.');
			return;
		}

		if (isPlaying) {
			window.speechSynthesis.cancel();
			isPlaying = false;
		} else {
			utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'vi-VN';
			utterance.rate = 0.8;
			
			utterance.onstart = () => {
				isPlaying = true;
			};
			
			utterance.onend = () => {
				isPlaying = false;
			};
			
			utterance.onerror = () => {
				isPlaying = false;
				alert('Có lỗi xảy ra khi đọc văn bản.');
			};
			
			window.speechSynthesis.speak(utterance);
		}
	}
</script>

<button 
	onclick={toggleSpeech}
	class="text-gray-500 hover:text-blue-600 transition-colors"
	aria-label={isPlaying ? 'Dừng đọc' : 'Đọc bài viết'}
	title={isPlaying ? 'Dừng đọc' : 'Đọc bài viết'}
>
	<i class="fas {isPlaying ? 'fa-stop' : 'fa-volume-up'}"></i>
</button>

<script>
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	
	let { url, title } = $props();
	let showModal = $state(false);
	let modalElement = $state(null);
	let firstFocusableElement = $state(null);
	let lastFocusableElement = $state(null);

	onMount(() => {
		if (showModal && modalElement) {
			setupFocusTrap();
		}
	});

	function openShareModal() {
		showModal = true;
		// Announce to screen readers
		announceToScreenReader('Hộp thoại chia sẻ đã mở');
	}

	function closeShareModal() {
		showModal = false;
		announceToScreenReader('Hộp thoại chia sẻ đã đóng');
	}

	function setupFocusTrap() {
		if (!modalElement) return;
		
		const focusableElements = modalElement.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		
		firstFocusableElement = focusableElements[0];
		lastFocusableElement = focusableElements[focusableElements.length - 1];
		
		// Focus first element
		if (firstFocusableElement) {
			firstFocusableElement.focus();
		}
	}

	function handleKeyDown(event) {
		if (event.key === 'Escape') {
			closeShareModal();
			return;
		}
		
		// Trap focus within modal
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				if (document.activeElement === firstFocusableElement) {
					event.preventDefault();
					lastFocusableElement?.focus();
				}
			} else {
				if (document.activeElement === lastFocusableElement) {
					event.preventDefault();
					firstFocusableElement?.focus();
				}
			}
		}
	}

	function announceToScreenReader(message) {
		if (!browser) return;
		
		const announcement = document.createElement('div');
		announcement.setAttribute('aria-live', 'polite');
		announcement.setAttribute('aria-atomic', 'true');
		announcement.className = 'sr-only';
		announcement.textContent = message;
		
		document.body.appendChild(announcement);
		
		setTimeout(() => {
			document.body.removeChild(announcement);
		}, 1000);
	}

	async function shareToSocial(platform) {
		if (!browser) return;
		
		const shareUrl = encodeURIComponent(window.location.origin + url);
		const shareTitle = encodeURIComponent(title);
		
		let shareLink = '';
		
		switch (platform) {
			case 'facebook':
				shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
				break;
			case 'twitter':
				shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
				break;
			case 'linkedin':
				shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
				break;
			case 'whatsapp':
				shareLink = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
				break;
			case 'telegram':
				shareLink = `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`;
				break;
			case 'email':
				shareLink = `mailto:?subject=${shareTitle}&body=${shareUrl}`;
				break;
		}
		
		if (shareLink) {
			window.open(shareLink, '_blank', 'width=600,height=400');
			announceToScreenReader(`Đã mở cửa sổ chia sẻ ${platform}`);
		}
	}

	async function copyToClipboard() {
		if (!browser) return;
		
		try {
			const fullUrl = window.location.origin + url;
			await navigator.clipboard.writeText(fullUrl);
			announceToScreenReader('Đã sao chép liên kết vào clipboard');
			
			// Visual feedback
			const button = event.target.closest('button');
			const originalText = button.innerHTML;
			button.innerHTML = '<i class="fas fa-check"></i> <span>Đã sao chép!</span>';
			button.classList.add('bg-green-600', 'hover:bg-green-700');
			button.classList.remove('bg-gray-600', 'hover:bg-gray-700');
			
			setTimeout(() => {
				button.innerHTML = originalText;
				button.classList.remove('bg-green-600', 'hover:bg-green-700');
				button.classList.add('bg-gray-600', 'hover:bg-gray-700');
			}, 2000);
		} catch (error) {
			console.error('Error copying to clipboard:', error);
			announceToScreenReader('Không thể sao chép liên kết');
			
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = window.location.origin + url;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			announceToScreenReader('Đã sao chép liên kết (fallback)');
		}
	}

	function handleModalClick(event) {
		if (event.target === event.currentTarget) {
			closeShareModal();
		}
	}

	// Test functions for integration testing
	export function testShareModal() {
		return {
			isOpen: showModal,
			open: openShareModal,
			close: closeShareModal,
			testCopyToClipboard: copyToClipboard,
			testSocialShare: shareToSocial
		};
	}
</script>

<button 
	onclick={openShareModal}
	class="text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
	aria-label="Chia sẻ bài viết: {title}"
	title="Chia sẻ"
>
	<i class="fas fa-share-alt" aria-hidden="true"></i>
</button>

{#if showModal}
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
		role="dialog" 
		aria-modal="true" 
		aria-labelledby="share-modal-title"
		onclick={handleModalClick}
		onkeydown={handleKeyDown}
		tabindex="-1"
	>
		<div 
			bind:this={modalElement}
			class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 shadow-2xl" 
			role="document"
		>
			<div class="flex justify-between items-center mb-4">
				<h3 id="share-modal-title" class="text-xl font-bold">Chia sẻ bài viết</h3>
				<button 
					type="button"
					onclick={closeShareModal} 
					class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1" 
					aria-label="Đóng hộp thoại chia sẻ"
				>
					<i class="fas fa-times" aria-hidden="true"></i>
				</button>
			</div>
			
			<div class="space-y-3">
				<button 
					type="button"
					onclick={() => shareToSocial('facebook')}
					class="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
					aria-label="Chia sẻ lên Facebook"
				>
					<i class="fab fa-facebook-f" aria-hidden="true"></i>
					<span>Facebook</span>
				</button>
				
				<button 
					type="button"
					onclick={() => shareToSocial('twitter')}
					class="w-full flex items-center gap-3 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors"
					aria-label="Chia sẻ lên Twitter"
				>
					<i class="fab fa-twitter" aria-hidden="true"></i>
					<span>Twitter</span>
				</button>
				
				<button 
					type="button"
					onclick={() => shareToSocial('linkedin')}
					class="w-full flex items-center gap-3 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
					aria-label="Chia sẻ lên LinkedIn"
				>
					<i class="fab fa-linkedin-in" aria-hidden="true"></i>
					<span>LinkedIn</span>
				</button>
				
				<button 
					type="button"
					onclick={() => shareToSocial('whatsapp')}
					class="w-full flex items-center gap-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
					aria-label="Chia sẻ qua WhatsApp"
				>
					<i class="fab fa-whatsapp" aria-hidden="true"></i>
					<span>WhatsApp</span>
				</button>
				
				<button 
					type="button"
					onclick={() => shareToSocial('telegram')}
					class="w-full flex items-center gap-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
					aria-label="Chia sẻ qua Telegram"
				>
					<i class="fab fa-telegram-plane" aria-hidden="true"></i>
					<span>Telegram</span>
				</button>
				
				<button 
					type="button"
					onclick={() => shareToSocial('email')}
					class="w-full flex items-center gap-3 p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
					aria-label="Chia sẻ qua Email"
				>
					<i class="fas fa-envelope" aria-hidden="true"></i>
					<span>Email</span>
				</button>
				
				<button 
					type="button"
					onclick={copyToClipboard}
					class="w-full flex items-center gap-3 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
					aria-label="Sao chép liên kết"
				>
					<i class="fas fa-copy" aria-hidden="true"></i>
					<span>Sao chép liên kết</span>
				</button>
			</div>
		</div>
	</div>
{/if}

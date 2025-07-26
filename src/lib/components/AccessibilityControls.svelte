<script>
	let { 
		theme, 
		fontSize, 
		highContrast,
		updateTheme,
		updateFontSize,
		updateHighContrast
	} = $props();

	function toggleHighContrast() {
		updateHighContrast(!highContrast);
	}

	function increaseFontSize() {
		if (fontSize < 200) {
			updateFontSize(fontSize + 20);
		}
	}

	function decreaseFontSize() {
		if (fontSize > 80) {
			updateFontSize(fontSize - 20);
		}
	}

	function toggleDarkMode() {
		updateTheme(theme === 'dark' ? 'light' : 'dark');
	}
</script>

<div class="accessibility-controls flex gap-2" role="toolbar" aria-label="Tùy chỉnh hiển thị">
	<button 
		class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" 
		onclick={toggleHighContrast}
		aria-pressed={highContrast}
		aria-label="Bật/tắt chế độ tương phản cao"
		title="Tương phản cao"
	>
		<i class="fas fa-adjust" aria-hidden="true"></i>
		<span class="hidden sm:inline ml-2">Tương phản cao</span>
	</button>
	
	<button 
		class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" 
		onclick={increaseFontSize}
		aria-label="Tăng cỡ chữ"
		title="Tăng cỡ chữ"
		disabled={fontSize >= 200}
	>
		<i class="fas fa-plus" aria-hidden="true"></i>
		<span class="hidden sm:inline ml-2">A+</span>
	</button>
	
	<button 
		class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" 
		onclick={decreaseFontSize}
		aria-label="Giảm cỡ chữ"
		title="Giảm cỡ chữ"
		disabled={fontSize <= 80}
	>
		<i class="fas fa-minus" aria-hidden="true"></i>
		<span class="hidden sm:inline ml-2">A-</span>
	</button>
	
	<button 
		class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" 
		onclick={toggleDarkMode}
		aria-pressed={theme === 'dark'}
		aria-label="Bật/tắt chế độ tối"
		title="Chế độ tối"
	>
		<i class="fas {theme === 'dark' ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>
		<span class="hidden sm:inline ml-2">
			{theme === 'dark' ? 'Sáng' : 'Tối'}
		</span>
	</button>
</div>

<style>
	.accessibility-controls {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 100;
		background: rgba(255, 255, 255, 0.95);
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.accessibility-controls button {
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.accessibility-controls button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		.accessibility-controls {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>

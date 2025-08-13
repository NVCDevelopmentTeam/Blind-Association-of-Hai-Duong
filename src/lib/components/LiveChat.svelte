<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import io from 'socket.io-client'; // Declare the io variable

	let showChat = $state(false);
	let messages = $state([
		{
			id: 1,
			text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
			isUser: false,
			isAdmin: false,
			timestamp: new Date()
		}
	]);
	let newMessage = $state('');
	let socket = null;
	let sessionId = '';
	let isConnectedToAdmin = $state(false);
	let isTyping = false;
	let fileInput = $state(null);

	onMount(() => {
		if (!browser) return;

		// Generate session ID
		sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

		// Initialize Socket.io if available
		if (typeof io !== 'undefined') {
			try {
				socket = io('http://localhost:3001');

				socket.on('connect', () => {
					console.log('Connected to chat server');
					socket.emit('join-chat', { sessionId, userId: null, isAdmin: false });
				});

				socket.on('chat-history', (history) => {
					messages = history.map((msg) => ({
						id: msg.id,
						text: msg.content,
						isUser: msg.isFromUser,
						isAdmin: msg.isFromAdmin,
						timestamp: new Date(msg.createdAt),
						type: msg.type
					}));
				});

				socket.on('new-message', (message) => {
					messages = [
						...messages,
						{
							id: message.id,
							text: message.content,
							isUser: message.isFromUser,
							isAdmin: message.isFromAdmin,
							timestamp: new Date(message.createdAt),
							type: message.type
						}
					];
				});

				socket.on('admin-joined', () => {
					isConnectedToAdmin = true;
					messages = [
						...messages,
						{
							id: Date.now(),
							text: 'Nhân viên tư vấn đã tham gia cuộc trò chuyện',
							isUser: false,
							isAdmin: false,
							timestamp: new Date(),
							isSystem: true
						}
					];
				});

				socket.on('video-call-request', () => {
					if (confirm('Nhân viên tư vấn muốn bắt đầu cuộc gọi video. Bạn có đồng ý không?')) {
						// Handle video call
						alert('Tính năng gọi video đang được phát triển');
					}
				});

				socket.on('voice-call-request', () => {
					if (confirm('Nhân viên tư vấn muốn bắt đầu cuộc gọi thoại. Bạn có đồng ý không?')) {
						// Handle voice call
						alert('Tính năng gọi thoại đang được phát triển');
					}
				});
			} catch (error) {
				console.error('Socket.io connection error:', error);
			}
		}
	});

	function toggleChat() {
		showChat = !showChat;
	}

	function sendMessage(event) {
		event.preventDefault();

		if (!newMessage.trim()) return;

		const messageText = newMessage;
		newMessage = '';

		// Add user message to UI immediately
		messages = [
			...messages,
			{
				id: Date.now(),
				text: messageText,
				isUser: true,
				isAdmin: false,
				timestamp: new Date()
			}
		];

		// Send via socket if available
		if (socket && socket.connected) {
			socket.emit('send-message', {
				sessionId,
				content: messageText,
				userId: null,
				isAdmin: false,
				type: 'TEXT'
			});
		} else {
			// Fallback to mock AI response
			setTimeout(() => {
				const botResponse = getBotResponse(messageText);
				messages = [
					...messages,
					{
						id: Date.now() + 1,
						text: botResponse,
						isUser: false,
						isAdmin: false,
						timestamp: new Date()
					}
				];
			}, 1000);
		}
	}

	function getBotResponse(message) {
		const lowerMessage = message.toLowerCase();

		if (lowerMessage.includes('đào tạo') || lowerMessage.includes('khóa học')) {
			return 'Chúng tôi có nhiều khóa đào tạo nghề như CNTT, massage, thủ công mỹ nghệ. Bạn quan tâm đến lĩnh vực nào?';
		} else if (lowerMessage.includes('việc làm') || lowerMessage.includes('tuyển dụng')) {
			return 'Trung tâm thường xuyên cập nhật thông tin việc làm phù hợp với người khiếm thị. Bạn có thể xem tại mục "Việc làm" hoặc liên hệ trực tiếp với chúng tôi.';
		} else if (lowerMessage.includes('liên hệ') || lowerMessage.includes('địa chỉ')) {
			return 'Bạn có thể liên hệ với chúng tôi qua số điện thoại: +84 123 456 789 hoặc email: info@ttphcn-haiduong.vn';
		} else if (lowerMessage.includes('phục hồi')) {
			return 'Chúng tôi cung cấp các dịch vụ phục hồi chức năng toàn diện, bao gồm định hướng di chuyển, kỹ năng sống độc lập và hỗ trợ tâm lý.';
		} else {
			return 'Cảm ơn bạn đã liên hệ. Để được hỗ trợ tốt nhất, tôi sẽ kết nối bạn với nhân viên tư vấn.';
		}
	}

	function requestVideoCall() {
		if (socket && socket.connected) {
			socket.emit('request-video-call', { sessionId, userId: null });
		} else {
			alert('Tính năng gọi video đang được phát triển');
		}
	}

	function requestVoiceCall() {
		if (socket && socket.connected) {
			socket.emit('request-voice-call', { sessionId, userId: null });
		} else {
			alert('Tính năng gọi thoại đang được phát triển');
		}
	}

	function sendEmoji(emoji) {
		if (socket && socket.connected) {
			socket.emit('send-message', {
				sessionId,
				content: emoji,
				userId: null,
				isAdmin: false,
				type: 'EMOJI'
			});
		}

		messages = [
			...messages,
			{
				id: Date.now(),
				text: emoji,
				isUser: true,
				isAdmin: false,
				timestamp: new Date()
			}
		];
	}

	function handleFileUpload(event) {
		const file = event.target.files[0];
		if (!file) return;

		// Check file size (max 10MB)
		if (file.size > 10 * 1024 * 1024) {
			alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			if (socket && socket.connected) {
				socket.emit('upload-file', {
					sessionId,
					fileData: e.target.result,
					fileName: file.name,
					fileType: file.type
				});
			}

			messages = [
				...messages,
				{
					id: Date.now(),
					text: `📎 ${file.name}`,
					isUser: true,
					isAdmin: false,
					timestamp: new Date(),
					type: 'FILE'
				}
			];
		};
		reader.readAsDataURL(file);

		// Reset file input
		event.target.value = '';
	}
</script>

<div class="live-chat fixed bottom-4 right-4 z-50">
	<button
		onclick={toggleChat}
		class="chat-toggle bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
		aria-label="Mở chat hỗ trợ"
	>
		<i class="fas fa-comments text-2xl"></i>
		{#if messages.length > 1}
			<span
				class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
			>
				{messages.length - 1}
			</span>
		{/if}
	</button>

	{#if showChat}
		<div
			class="chat-window fixed bottom-20 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600"
		>
			<div
				class="chat-header p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center"
			>
				<div>
					<h3 class="font-bold">Chat hỗ trợ</h3>
					{#if isConnectedToAdmin}
						<p class="text-xs opacity-90">Đang chat với nhân viên tư vấn</p>
					{:else}
						<p class="text-xs opacity-90">AI Assistant</p>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					{#if isConnectedToAdmin}
						<button
							onclick={requestVoiceCall}
							class="p-2 hover:bg-blue-700 rounded-full transition-colors"
							title="Gọi thoại"
							aria-label="Gọi thoại"
						>
							<i class="fas fa-phone text-sm"></i>
						</button>
						<button
							onclick={requestVideoCall}
							class="p-2 hover:bg-blue-700 rounded-full transition-colors"
							title="Gọi video"
							aria-label="Gọi video"
						>
							<i class="fas fa-video text-sm"></i>
						</button>
					{/if}
					<button
						onclick={toggleChat}
						aria-label="Đóng chat"
						class="p-2 hover:bg-blue-700 rounded-full transition-colors"
					>
						<i class="fas fa-times"></i>
					</button>
				</div>
			</div>

			<div class="chat-messages h-96 overflow-y-auto p-4 space-y-4">
				{#each messages as message}
					<div class="message flex {message.isUser ? 'justify-end' : 'justify-start'}">
						<div
							class="message-bubble max-w-xs p-3 rounded-lg {message.isUser
								? 'bg-blue-600 text-white'
								: message.isSystem
									? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}"
						>
							{#if message.type === 'FILE'}
								<div class="flex items-center gap-2">
									<i class="fas fa-paperclip"></i>
									<span class="text-sm">{message.text}</span>
								</div>
							{:else}
								<p class="text-sm">{message.text}</p>
							{/if}
							<div class="flex items-center justify-between mt-1">
								<span class="text-xs opacity-70">
									{message.timestamp.toLocaleTimeString('vi-VN', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</span>
								{#if message.isAdmin}
									<span class="text-xs bg-green-500 text-white px-1 rounded">Admin</span>
								{/if}
							</div>
						</div>
					</div>
				{/each}

				{#if isTyping}
					<div class="message flex justify-start">
						<div class="message-bubble max-w-xs p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
							<div class="flex space-x-1">
								<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
								<div
									class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
									style="animation-delay: 0.1s"
								></div>
								<div
									class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
									style="animation-delay: 0.2s"
								></div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Emoji Bar -->
			<div class="emoji-bar p-2 border-t border-gray-200 dark:border-gray-600">
				<div class="flex gap-2 justify-center">
					{#each ['👍', '👎', '😊', '😢', '❤️', '🙏'] as emoji}
						<button
							onclick={() => sendEmoji(emoji)}
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
							title="Gửi {emoji}"
						>
							{emoji}
						</button>
					{/each}
				</div>
			</div>

			<form
				onsubmit={sendMessage}
				class="chat-input p-4 border-t border-gray-200 dark:border-gray-600"
			>
				<div class="flex gap-2">
					<input
						type="file"
						bind:this={fileInput}
						onchange={handleFileUpload}
						class="hidden"
						accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
					/>
					<button
						type="button"
						onclick={() => fileInput?.click()}
						class="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
						title="Gửi file"
						aria-label="Gửi file"
					>
						<i class="fas fa-paperclip"></i>
					</button>
					<input
						type="text"
						bind:value={newMessage}
						class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
						placeholder="Nhập tin nhắn..."
						aria-label="Nhập tin nhắn"
					/>
					<button
						type="submit"
						class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						aria-label="Gửi tin nhắn"
					>
						<i class="fas fa-paper-plane"></i>
					</button>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	@media (max-width: 640px) {
		.chat-window {
			width: calc(100vw - 2rem);
			right: 1rem;
		}
	}
</style>

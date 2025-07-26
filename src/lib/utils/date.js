export function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function formatDateTime(dateString) {
	const date = new Date(dateString);
	return date.toLocaleString('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function timeAgo(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now - date) / 1000);

	if (diffInSeconds < 60) return 'Vừa xong';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
	if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

	return formatDate(dateString);
}

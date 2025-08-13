import { json } from '@sveltejs/kit';

// Mock media files
const mockMediaFiles = [
	{
		id: 1,
		name: 'hero-image.jpg',
		url: '/placeholder.svg?height=400&width=600',
		type: 'image/jpeg',
		size: 245760,
		uploadedAt: '2024-03-10T09:00:00Z'
	},
	{
		id: 2,
		name: 'training-video.mp4',
		url: '/placeholder.svg?height=300&width=400',
		type: 'video/mp4',
		size: 15728640,
		uploadedAt: '2024-03-09T15:30:00Z'
	}
];

export async function GET() {
	return json(mockMediaFiles);
}

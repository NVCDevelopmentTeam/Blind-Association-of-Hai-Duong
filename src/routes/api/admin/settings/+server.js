import { json } from '@sveltejs/kit';

// Mock settings data
const mockSettings = {
	siteName: 'Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương',
	siteDescription: 'Nơi hỗ trợ, đào tạo và tạo việc làm cho người khiếm thị',
	contactEmail: 'info@ttphcn-haiduong.vn',
	contactPhone: '+84 123 456 789',
	address: 'Hải Dương, Việt Nam',
	facebookUrl: 'https://facebook.com',
	youtubeUrl: 'https://youtube.com',
	twitterUrl: 'https://twitter.com',
	enableRegistration: true,
	enableComments: true,
	maintenanceMode: false
};

export async function GET() {
	return json(mockSettings);
}

export async function PUT({ request }) {
	const settings = await request.json();

	// Mock saving settings - in a real app, this would save to database
	console.log('Saving settings:', settings);

	return json({ success: true });
}

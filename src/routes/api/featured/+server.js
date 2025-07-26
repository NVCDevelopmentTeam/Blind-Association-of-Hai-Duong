import { json } from '@sveltejs/kit';

// Mock featured content data
const mockFeatured = [
	{
		id: 1,
		title: 'Chương trình phục hồi chức năng toàn diện',
		excerpt: 'Phương pháp phục hồi chức năng hiện đại và hiệu quả cho người khiếm thị',
		url: '/phuc-hoi/chuong-trinh-phuc-hoi-toan-dien',
		category: 'Phục hồi'
	},
	{
		id: 2,
		title: 'Khóa học lập trình dành cho người khiếm thị',
		excerpt: 'Học lập trình với các công cụ hỗ trợ chuyên dụng',
		url: '/dao-tao/khoa-hoc-lap-trinh',
		category: 'Đào tạo'
	},
	{
		id: 3,
		title: 'Cơ hội việc làm tại các công ty công nghệ',
		excerpt: 'Danh sách các vị trí việc làm phù hợp với người khiếm thị',
		url: '/viec-lam/cong-ty-cong-nghe',
		category: 'Việc làm'
	},
	{
		id: 4,
		title: 'Hỗ trợ thiết bị học tập miễn phí',
		excerpt: 'Chương trình hỗ trợ thiết bị học tập cho học viên có hoàn cảnh khó khăn',
		url: '/ho-tro/thiet-bi-hoc-tap',
		category: 'Hỗ trợ'
	}
];

export async function GET() {
	return json(mockFeatured);
}

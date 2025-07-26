import { json } from '@sveltejs/kit';

// Mock search data - in a real app, this would search a database
const searchableContent = [
	{
		id: 1,
		title: 'Chương trình đào tạo kỹ năng CNTT cho người khiếm thị',
		excerpt: 'Hội Người Mù Việt Nam tổ chức khóa đào tạo về công nghệ thông tin...',
		url: '/tin-tuc/chuong-trinh-dao-tao-ky-nang-cntt-cho-nguoi-khiem-thi',
		type: 'news',
		category: 'Đào tạo'
	},
	{
		id: 2,
		title: 'Hỗ trợ sinh kế cho người khiếm thị',
		excerpt: 'Chương trình hỗ trợ việc làm và tạo thu nhập cho người khiếm thị...',
		url: '/tin-tuc/ho-tro-sinh-ke-cho-nguoi-khiem-thi',
		type: 'news',
		category: 'Việc làm'
	},
	{
		id: 3,
		title: 'Giới thiệu về trung tâm',
		excerpt: 'Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương...',
		url: '/gioi-thieu',
		type: 'page',
		category: 'Thông tin'
	},
	{
		id: 4,
		title: 'Các khóa học đào tạo nghề',
		excerpt: 'Danh sách các khóa học đào tạo nghề dành cho người khiếm thị...',
		url: '/dao-tao',
		type: 'page',
		category: 'Đào tạo'
	},
	{
		id: 5,
		title: 'Cơ hội việc làm',
		excerpt: 'Thông tin về các cơ hội việc làm dành cho người khiếm thị...',
		url: '/viec-lam',
		type: 'page',
		category: 'Việc làm'
	}
];

export async function GET({ url }) {
	const query = url.searchParams.get('q')?.toLowerCase() || '';

	if (!query) {
		return json([]);
	}

	const results = searchableContent.filter(
		(item) =>
			item.title.toLowerCase().includes(query) ||
			item.excerpt.toLowerCase().includes(query) ||
			item.category.toLowerCase().includes(query)
	);

	return json(results);
}

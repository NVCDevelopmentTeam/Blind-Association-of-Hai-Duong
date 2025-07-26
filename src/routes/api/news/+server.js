import { json } from '@sveltejs/kit';

// Mock data - in a real app, this would come from a database
const mockNews = [
	{
		id: 1,
		title: 'Chương trình đào tạo kỹ năng CNTT cho người khiếm thị',
		slug: 'chuong-trinh-dao-tao-ky-nang-cntt-cho-nguoi-khiem-thi',
		excerpt: 'Hội Người Mù Việt Nam tổ chức khóa đào tạo về công nghệ thông tin dành riêng cho người khiếm thị...',
		content: 'Nội dung chi tiết về chương trình đào tạo CNTT...',
		image: '/placeholder.svg?height=300&width=400',
		publishedAt: '2024-03-12T10:00:00Z',
		category: 'Đào tạo',
		author: 'Admin',
		featured: true
	},
	{
		id: 2,
		title: 'Hỗ trợ sinh kế cho người khiếm thị',
		slug: 'ho-tro-sinh-ke-cho-nguoi-khiem-thi',
		excerpt: 'Chương trình hỗ trợ việc làm và tạo thu nhập cho người khiếm thị tại Hải Dương...',
		content: 'Nội dung chi tiết về chương trình hỗ trợ sinh kế...',
		image: '/placeholder.svg?height=300&width=400',
		publishedAt: '2024-03-11T14:30:00Z',
		category: 'Việc làm',
		author: 'Admin',
		featured: false
	},
	{
		id: 3,
		title: 'Hoạt động văn nghệ chào mừng ngày người khuyết tật',
		slug: 'hoat-dong-van-nghe-chao-mung-ngay-nguoi-khuyet-tat',
		excerpt: 'Chuỗi hoạt động văn hóa nghệ thuật đặc sắc nhân ngày Quốc tế người khuyết tật...',
		content: 'Nội dung chi tiết về hoạt động văn nghệ...',
		image: '/placeholder.svg?height=300&width=400',
		publishedAt: '2024-03-10T09:15:00Z',
		category: 'Hoạt động',
		author: 'Admin',
		featured: true
	},
	{
		id: 4,
		title: 'Khai giảng khóa học massage trị liệu',
		slug: 'khai-giang-khoa-hoc-massage-tri-lieu',
		excerpt: 'Trung tâm khai giảng khóa học massage trị liệu dành cho người khiếm thị...',
		content: 'Nội dung chi tiết về khóa học massage...',
		image: '/placeholder.svg?height=300&width=400',
		publishedAt: '2024-03-09T16:45:00Z',
		category: 'Đào tạo',
		author: 'Admin',
		featured: false
	},
	{
		id: 5,
		title: 'Trao tặng thiết bị hỗ trợ học tập',
		slug: 'trao-tang-thiet-bi-ho-tro-hoc-tap',
		excerpt: 'Trao tặng các thiết bị hỗ trợ học tập hiện đại cho học viên khiếm thị...',
		content: 'Nội dung chi tiết về việc trao tặng thiết bị...',
		image: '/placeholder.svg?height=300&width=400',
		publishedAt: '2024-03-08T11:20:00Z',
		category: 'Hỗ trợ',
		author: 'Admin',
		featured: false
	},
	{
		id: 6,
		title: 'Hội thảo về công nghệ hỗ trợ người khiếm thị',
		slug: 'hoi-thao-ve-cong-nghe-ho-tro-nguoi-khiem-thi',
		excerpt: 'Hội thảo quốc tế về các công nghệ mới hỗ trợ người khiếm thị trong học tập và làm việc...',
		content: 'Nội dung chi tiết về hội thảo công nghệ...',
		image: '/placeholder.svg?height=300&width=400',
		publishedAt: '2024-03-07T13:00:00Z',
		category: 'Hội thảo',
		author: 'Admin',
		featured: true
	}
];

export async function GET({ url }) {
	const limit = Number.parseInt(url.searchParams.get('limit') || '10');
	const category = url.searchParams.get('category');
	const featured = url.searchParams.get('featured') === 'true';

	let filteredNews = mockNews;

	if (category) {
		filteredNews = filteredNews.filter((news) => news.category === category);
	}

	if (featured) {
		filteredNews = filteredNews.filter((news) => news.featured);
	}

	const limitedNews = filteredNews.slice(0, limit);

	return json(limitedNews);
}

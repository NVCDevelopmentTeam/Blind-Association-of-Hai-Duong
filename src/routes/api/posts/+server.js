import { json } from '@sveltejs/kit';

// Mock data - in a real app, this would come from a database
const mockPosts = [
	{
		id: 1,
		title: 'Chương trình đào tạo kỹ năng CNTT cho người khiếm thị',
		slug: 'chuong-trinh-dao-tao-ky-nang-cntt-cho-nguoi-khiem-thi',
		excerpt:
			'Hội Người Mù Việt Nam tổ chức khóa đào tạo về công nghệ thông tin dành riêng cho người khiếm thị...',
		content: '<p>Nội dung chi tiết về chương trình đào tạo CNTT...</p>',
		featuredImage: '/placeholder.svg?height=300&width=400&text=CNTT',
		publishedAt: '2024-03-12T10:00:00Z',
		status: 'PUBLISHED',
		type: 'POST',
		categories: [{ id: '1', name: 'Đào tạo', slug: 'dao-tao' }],
		tags: [{ id: '1', name: 'CNTT', slug: 'cntt' }],
		author: { id: '1', name: 'Admin', avatar: null },
		featured: true,
		metaTitle: 'Chương trình đào tạo CNTT cho người khiếm thị',
		metaDescription: 'Khóa đào tạo công nghệ thông tin chuyên biệt dành cho người khiếm thị'
	},
	{
		id: 2,
		title: 'Hỗ trợ sinh kế cho người khiếm thị',
		slug: 'ho-tro-sinh-ke-cho-nguoi-khiem-thi',
		excerpt: 'Chương trình hỗ trợ việc làm và tạo thu nhập cho người khiếm thị tại Hải Dương...',
		content: '<p>Nội dung chi tiết về chương trình hỗ trợ sinh kế...</p>',
		featuredImage: '/placeholder.svg?height=300&width=400&text=Sinh+kế',
		publishedAt: '2024-03-11T14:30:00Z',
		status: 'PUBLISHED',
		type: 'POST',
		categories: [{ id: '2', name: 'Việc làm', slug: 'viec-lam' }],
		tags: [{ id: '2', name: 'Sinh kế', slug: 'sinh-ke' }],
		author: { id: '1', name: 'Admin', avatar: null },
		featured: false,
		metaTitle: 'Hỗ trợ sinh kế cho người khiếm thị',
		metaDescription: 'Chương trình hỗ trợ việc làm và tạo thu nhập bền vững'
	},
	{
		id: 3,
		title: 'Hoạt động văn nghệ chào mừng ngày người khuyết tật',
		slug: 'hoat-dong-van-nghe-chao-mung-ngay-nguoi-khuyet-tat',
		excerpt: 'Chuỗi hoạt động văn hóa nghệ thuật đặc sắc nhân ngày Quốc tế người khuyết tật...',
		content: '<p>Nội dung chi tiết về hoạt động văn nghệ...</p>',
		featuredImage: '/placeholder.svg?height=300&width=400&text=Văn+nghệ',
		publishedAt: '2024-03-10T09:15:00Z',
		status: 'PUBLISHED',
		type: 'POST',
		categories: [{ id: '3', name: 'Hoạt động', slug: 'hoat-dong' }],
		tags: [{ id: '3', name: 'Văn nghệ', slug: 'van-nghe' }],
		author: { id: '1', name: 'Admin', avatar: null },
		featured: true,
		metaTitle: 'Hoạt động văn nghệ ngày người khuyết tật',
		metaDescription: 'Chương trình văn hóa nghệ thuật đặc sắc và ý nghĩa'
	},
	{
		id: 4,
		title: 'Khai giảng khóa học massage trị liệu',
		slug: 'khai-giang-khoa-hoc-massage-tri-lieu',
		excerpt: 'Trung tâm khai giảng khóa học massage trị liệu dành cho người khiếm thị...',
		content: '<p>Nội dung chi tiết về khóa học massage...</p>',
		featuredImage: '/placeholder.svg?height=300&width=400&text=Massage',
		publishedAt: '2024-03-09T16:45:00Z',
		status: 'PUBLISHED',
		type: 'POST',
		categories: [{ id: '1', name: 'Đào tạo', slug: 'dao-tao' }],
		tags: [{ id: '4', name: 'Massage', slug: 'massage' }],
		author: { id: '1', name: 'Admin', avatar: null },
		featured: false,
		metaTitle: 'Khóa học massage trị liệu chuyên nghiệp',
		metaDescription: 'Đào tạo kỹ năng massage trị liệu cho người khiếm thị'
	}
];

export async function GET({ url }) {
	try {
		const limit = Number.parseInt(url.searchParams.get('limit') || '10');
		const status = url.searchParams.get('status') || 'PUBLISHED';
		const featured = url.searchParams.get('featured') === 'true';
		const category = url.searchParams.get('category');
		const search = url.searchParams.get('search');
		const page = Number.parseInt(url.searchParams.get('page') || '1');

		let filteredPosts = mockPosts.filter((post) => post.status === status);

		if (featured) {
			filteredPosts = filteredPosts.filter((post) => post.featured);
		}

		if (category) {
			filteredPosts = filteredPosts.filter((post) =>
				post.categories.some((cat) => cat.slug === category)
			);
		}

		if (search) {
			const searchLower = search.toLowerCase();
			filteredPosts = filteredPosts.filter(
				(post) =>
					post.title.toLowerCase().includes(searchLower) ||
					post.excerpt.toLowerCase().includes(searchLower) ||
					post.content.toLowerCase().includes(searchLower)
			);
		}

		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

		return json({
			success: true,
			posts: paginatedPosts,
			pagination: {
				page,
				limit,
				total: filteredPosts.length,
				pages: Math.ceil(filteredPosts.length / limit),
				hasNext: endIndex < filteredPosts.length,
				hasPrev: page > 1
			}
		});
	} catch (error) {
		console.error('Posts API error:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch posts',
				posts: [],
				pagination: { page: 1, limit: 10, total: 0, pages: 0, hasNext: false, hasPrev: false }
			},
			{ status: 500 }
		);
	}
}

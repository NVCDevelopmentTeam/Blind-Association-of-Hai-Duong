import { json } from "@sveltejs/kit"

// Mock news data for admin - in a real app, this would come from a database
const mockAdminNews = [
  {
    id: 1,
    title: "Chương trình đào tạo kỹ năng CNTT cho người khiếm thị",
    slug: "chuong-trinh-dao-tao-ky-nang-cntt-cho-nguoi-khiem-thi",
    excerpt: "Hội Người Mù Việt Nam tổ chức khóa đào tạo về công nghệ thông tin dành riêng cho người khiếm thị...",
    content: "Nội dung chi tiết về chương trình đào tạo CNTT...",
    image: "/placeholder.svg?height=300&width=400",
    publishedAt: "2024-03-12T10:00:00Z",
    category: "Đào tạo",
    author: "Admin",
    featured: true,
  },
  {
    id: 2,
    title: "Hỗ trợ sinh kế cho người khiếm thị",
    slug: "ho-tro-sinh-ke-cho-nguoi-khiem-thi",
    excerpt: "Chương trình hỗ trợ việc làm và tạo thu nhập cho người khiếm thị tại Hải Dương...",
    content: "Nội dung chi tiết về chương trình hỗ trợ sinh kế...",
    image: "/placeholder.svg?height=300&width=400",
    publishedAt: "2024-03-11T14:30:00Z",
    category: "Việc làm",
    author: "Admin",
    featured: false,
  },
]

export async function GET() {
  return json(mockAdminNews)
}

export async function POST({ request }) {
  const articleData = await request.json()

  // Mock creating new article
  const newArticle = {
    id: Date.now(),
    ...articleData,
    author: "Admin",
  }

  mockAdminNews.unshift(newArticle)

  return json(newArticle, { status: 201 })
}

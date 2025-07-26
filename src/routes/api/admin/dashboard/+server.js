import { json } from "@sveltejs/kit"

export async function GET() {
  // Mock dashboard data - in a real app, this would come from a database
  const stats = {
    totalNews: 25,
    totalUsers: 150,
    todayVisitors: 342,
    totalVisitors: 15420,
  }

  const recentActivity = [
    {
      id: 1,
      title: "Bài viết mới được đăng",
      description: "Chương trình đào tạo CNTT cho người khiếm thị",
      icon: "fa-newspaper",
      time: "2 giờ trước",
    },
    {
      id: 2,
      title: "Người dùng mới đăng ký",
      description: "Nguyễn Văn A đã tạo tài khoản",
      icon: "fa-user-plus",
      time: "4 giờ trước",
    },
    {
      id: 3,
      title: "Bài viết được cập nhật",
      description: "Hỗ trợ sinh kế cho người khiếm thị",
      icon: "fa-edit",
      time: "1 ngày trước",
    },
  ]

  return json({
    stats,
    recentActivity,
  })
}

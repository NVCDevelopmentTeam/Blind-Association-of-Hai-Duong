import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@ttphcn-haiduong.vn" },
    update: {},
    create: {
      email: "admin@ttphcn-haiduong.vn",
      name: "Administrator",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  // Create categories
  const categories = [
    { name: "Đào tạo", slug: "dao-tao", description: "Các chương trình đào tạo nghề", color: "#3B82F6" },
    { name: "Việc làm", slug: "viec-lam", description: "Thông tin việc làm và tuyển dụng", color: "#10B981" },
    { name: "Hoạt động", slug: "hoat-dong", description: "Các hoạt động của trung tâm", color: "#F59E0B" },
    { name: "Hỗ trợ", slug: "ho-tro", description: "Chương trình hỗ trợ người khiếm thị", color: "#EF4444" },
    { name: "Tin tức", slug: "tin-tuc", description: "Tin tức và thông báo", color: "#8B5CF6" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create tags
  const tags = [
    { name: "CNTT", slug: "cntt" },
    { name: "Massage", slug: "massage" },
    { name: "Thủ công", slug: "thu-cong" },
    { name: "Tuyển dụng", slug: "tuyen-dung" },
    { name: "Hội thảo", slug: "hoi-thao" },
    { name: "Từ thiện", slug: "tu-thien" },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }

  // Create sample posts
  const daoTaoCategory = await prisma.category.findUnique({ where: { slug: "dao-tao" } })
  const viecLamCategory = await prisma.category.findUnique({ where: { slug: "viec-lam" } })

  const posts = [
    {
      title: "Chương trình đào tạo CNTT cho người khiếm thị năm 2024",
      slug: "chuong-trinh-dao-tao-cntt-2024",
      content: `# Chương trình đào tạo CNTT cho người khiếm thị

## Giới thiệu chương trình

Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương tổ chức chương trình đào tạo CNTT chuyên sâu dành cho người khiếm thị.

## Nội dung đào tạo

### 1. Kỹ năng cơ bản
- Sử dụng máy tính với phần mềm đọc màn hình
- Thao tác với bàn phím và các phím tắt
- Quản lý file và thư mục

### 2. Lập trình web
- HTML, CSS cơ bản
- JavaScript và các framework
- Accessibility trong web development

### 3. Kỹ năng mềm
- Làm việc nhóm
- Giao tiếp với khách hàng
- Quản lý thời gian

## Thời gian và địa điểm

- **Thời gian**: 6 tháng (từ tháng 3 đến tháng 8/2024)
- **Địa điểm**: Trung tâm PHCN Hải Dương
- **Học phí**: Miễn phí

## Đăng ký tham gia

Liên hệ hotline: **0123 456 789** để đăng ký tham gia.`,
      excerpt: "Chương trình đào tạo CNTT 6 tháng hoàn toàn miễn phí dành cho người khiếm thị tại Hải Dương",
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-15"),
      categoryId: daoTaoCategory?.id,
      authorId: admin.id,
      featuredImage: "/placeholder.svg?height=400&width=600&text=Đào+tạo+CNTT",
    },
    {
      title: "Cơ hội việc làm tại các công ty công nghệ",
      slug: "co-hoi-viec-lam-cong-ty-cong-nghe",
      content: `# Cơ hội việc làm tại các công ty công nghệ

## Tổng quan thị trường

Ngành công nghệ thông tin đang có nhu cầu tuyển dụng cao, đặc biệt là các vị trí phù hợp với người khiếm thị.

## Các vị trí phù hợp

### 1. Lập trình viên
- **Mức lương**: 8-15 triệu/tháng
- **Yêu cầu**: Kiến thức lập trình tốt
- **Kỹ năng**: HTML, CSS, JavaScript, Python

### 2. Tester phần mềm
- **Mức lương**: 6-12 triệu/tháng
- **Yêu cầu**: Tỉ mỉ, cẩn thận
- **Kỹ năng**: Kiểm thử phần mềm, viết test case

### 3. Content Writer
- **Mức lương**: 5-10 triệu/tháng
- **Yêu cầu**: Kỹ năng viết tốt
- **Kỹ năng**: SEO, copywriting

## Hỗ trợ tìm việc

Trung tâm cam kết hỗ trợ 100% học viên tìm được việc làm phù hợp sau khi hoàn thành khóa học.`,
      excerpt: "Khám phá các cơ hội việc làm hấp dẫn trong ngành công nghệ dành cho người khiếm thị",
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-10"),
      categoryId: viecLamCategory?.id,
      authorId: admin.id,
      featuredImage: "/placeholder.svg?height=400&width=600&text=Việc+làm+IT",
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  // Create sample pages
  const pages = [
    {
      title: "Giới thiệu",
      slug: "gioi-thieu",
      content: `# Giới thiệu về Trung tâm

Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương được thành lập với sứ mệnh hỗ trợ người khiếm thị hòa nhập cộng đồng.

## Sứ mệnh

- Phục hồi chức năng toàn diện
- Đào tạo nghề và kỹ năng sống
- Tạo cơ hội việc làm
- Nâng cao chất lượng cuộc sống

## Tầm nhìn

Trở thành trung tâm hàng đầu về phục hồi chức năng và đào tạo nghề cho người khiếm thị tại Việt Nam.`,
      status: "PUBLISHED",
      metaTitle: "Giới thiệu - Trung tâm PHCN Hải Dương",
      metaDesc: "Tìm hiểu về sứ mệnh và tầm nhìn của Trung tâm Phục hồi chức năng Hải Dương",
    },
    {
      title: "Liên hệ",
      slug: "lien-he",
      content: `# Liên hệ với chúng tôi

## Thông tin liên hệ

**Địa chỉ**: Hải Dương, Việt Nam
**Điện thoại**: +84 123 456 789
**Email**: info@ttphcn-haiduong.vn

## Giờ làm việc

- **Thứ 2 - Thứ 6**: 8:00 - 17:00
- **Thứ 7**: 8:00 - 12:00
- **Chủ nhật**: Nghỉ

## Bản đồ

[Bản đồ sẽ được hiển thị tại đây]`,
      status: "PUBLISHED",
      metaTitle: "Liên hệ - Trung tâm PHCN Hải Dương",
      metaDesc: "Thông tin liên hệ và địa chỉ của Trung tâm Phục hồi chức năng Hải Dương",
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    })
  }

  // Create settings
  const settings = [
    { key: "site_name", value: "Trung tâm PHCN Hải Dương" },
    { key: "site_description", value: "Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương" },
    { key: "contact_email", value: "info@ttphcn-haiduong.vn" },
    { key: "contact_phone", value: "+84 123 456 789" },
    { key: "address", value: "Hải Dương, Việt Nam" },
    { key: "facebook_url", value: "https://facebook.com/ttphcn-haiduong" },
    { key: "youtube_url", value: "https://youtube.com/ttphcn-haiduong" },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@ttphcn-haiduong.vn" },
    update: {},
    create: {
      email: "admin@ttphcn-haiduong.vn",
      password: hashedPassword,
      name: "Quản trị viên",
      role: "ADMIN",
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "dao-tao" },
      update: {},
      create: {
        name: "Đào tạo",
        slug: "dao-tao",
        description: "Các chương trình đào tạo nghề",
        color: "#3B82F6",
      },
    }),
    prisma.category.upsert({
      where: { slug: "viec-lam" },
      update: {},
      create: {
        name: "Việc làm",
        slug: "viec-lam",
        description: "Thông tin việc làm và tuyển dụng",
        color: "#10B981",
      },
    }),
    prisma.category.upsert({
      where: { slug: "hoat-dong" },
      update: {},
      create: {
        name: "Hoạt động",
        slug: "hoat-dong",
        description: "Các hoạt động của trung tâm",
        color: "#F59E0B",
      },
    }),
  ])

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "cntt" },
      update: {},
      create: {
        name: "CNTT",
        slug: "cntt",
        color: "#3B82F6",
      },
    }),
    prisma.tag.upsert({
      where: { slug: "massage" },
      update: {},
      create: {
        name: "Massage",
        slug: "massage",
        color: "#10B981",
      },
    }),
  ])

  // Create sample posts
  const posts = [
    {
      title: "Chương trình đào tạo kỹ năng CNTT cho người khiếm thị",
      slug: "chuong-trinh-dao-tao-ky-nang-cntt-cho-nguoi-khiem-thi",
      excerpt: "Hội Người Mù Việt Nam tổ chức khóa đào tạo về công nghệ thông tin dành riêng cho người khiếm thị...",
      content: `
# Chương trình đào tạo kỹ năng CNTT cho người khiếm thị

## Giới thiệu chương trình

Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương tự hào giới thiệu chương trình đào tạo kỹ năng Công nghệ Thông tin (CNTT) dành riêng cho người khiếm thị. Đây là một sáng kiến quan trọng nhằm tạo cơ hội việc làm và hòa nhập xã hội cho cộng đồng người khiếm thị.

## Mục tiêu chương trình

- Trang bị kiến thức cơ bản về máy tính và công nghệ thông tin
- Đào tạo kỹ năng sử dụng phần mềm hỗ trợ người khiếm thị
- Phát triển khả năng lập trình cơ bản
- Tạo cơ hội việc làm trong lĩnh vực CNTT

## Nội dung đào tạo

### Module 1: Cơ bản về máy tính
- Làm quen với máy tính và hệ điều hành
- Sử dụng bàn phím và các phím tắt
- Quản lý file và thư mục

### Module 2: Phần mềm hỗ trợ
- NVDA Screen Reader
- JAWS Screen Reader
- Phần mềm phóng to màn hình

### Module 3: Lập trình cơ bản
- Ngôn ngữ lập trình Python
- Phát triển ứng dụng web cơ bản
- Cơ sở dữ liệu

## Thời gian và địa điểm

- **Thời gian**: 6 tháng (3 buổi/tuần)
- **Địa điểm**: Trung tâm PHCN Hải Dương
- **Học phí**: Miễn phí cho học viên có hoàn cảnh khó khăn

## Đăng ký tham gia

Để đăng ký tham gia chương trình, vui lòng liên hệ:
- **Điện thoại**: +84 123 456 789
- **Email**: info@ttphcn-haiduong.vn
- **Địa chỉ**: Hải Dương, Việt Nam
      `,
      status: "PUBLISHED",
      type: "POST",
      metaTitle: "Chương trình đào tạo CNTT cho người khiếm thị - TTPHCN Hải Dương",
      metaDescription: "Khóa đào tạo công nghệ thông tin chuyên biệt dành cho người khiếm thị tại Hải Dương",
      publishedAt: new Date("2024-03-12T10:00:00Z"),
      authorId: admin.id,
      featuredImage: "/placeholder.svg?height=400&width=600&text=Đào+tạo+CNTT",
    },
    {
      title: "Hỗ trợ sinh kế cho người khiếm thị",
      slug: "ho-tro-sinh-ke-cho-nguoi-khiem-thi",
      excerpt: "Chương trình hỗ trợ việc làm và tạo thu nhập cho người khiếm thị tại Hải Dương...",
      content: `
# Hỗ trợ sinh kế cho người khiếm thị

## Tổng quan chương trình

Chương trình hỗ trợ sinh kế là một trong những hoạt động cốt lõi của Trung tâm, nhằm giúp người khiếm thị có thể tự lập về kinh tế và hòa nhập vào cộng đồng.

## Các hình thức hỗ trợ

### 1. Đào tạo nghề
- Massage trị liệu
- Thủ công mỹ nghệ
- Kỹ năng CNTT
- Dịch vụ khách hàng

### 2. Hỗ trợ vốn khởi nghiệp
- Vay vốn ưu đãi
- Tư vấn kinh doanh
- Hỗ trợ marketing

### 3. Kết nối việc làm
- Giới thiệu việc làm
- Tư vấn nghề nghiệp
- Theo dõi và hỗ trợ sau khi có việc

## Thành tựu đạt được

- Đã hỗ trợ hơn 500 người khiếm thị có việc làm ổn định
- Tỷ lệ thành công 85%
- Thu nhập trung bình tăng 200%

## Liên hệ tham gia

Để được tư vấn và hỗ trợ, vui lòng liên hệ với chúng tôi qua:
- Hotline: +84 123 456 789
- Email: sinhke@ttphcn-haiduong.vn
      `,
      status: "PUBLISHED",
      type: "POST",
      metaTitle: "Hỗ trợ sinh kế cho người khiếm thị - TTPHCN Hải Dương",
      metaDescription: "Chương trình hỗ trợ việc làm và tạo thu nhập bền vững cho người khiếm thị",
      publishedAt: new Date("2024-03-11T14:30:00Z"),
      authorId: admin.id,
      featuredImage: "/placeholder.svg?height=400&width=600&text=Hỗ+trợ+sinh+kế",
    },
    {
      title: "Giới thiệu về Trung tâm",
      slug: "gioi-thieu-ve-trung-tam",
      excerpt: "Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương...",
      content: `
# Giới thiệu về Trung tâm

## Lịch sử hình thành

Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương được thành lập năm 2010 với sứ mệnh hỗ trợ cộng đồng người khiếm thị trong việc phục hồi chức năng, đào tạo nghề và hòa nhập xã hội.

## Tầm nhìn và sứ mệnh

### Tầm nhìn
Trở thành trung tâm hàng đầu trong việc hỗ trợ người khiếm thị tại khu vực miền Bắc, góp phần xây dựng một xã hội bình đẳng và hòa nhập.

### Sứ mệnh
- Cung cấp dịch vụ phục hồi chức năng chất lượng cao
- Đào tạo nghề nghiệp phù hợp với nhu cầu thị trường
- Tạo cơ hội việc làm bền vững
- Nâng cao nhận thức cộng đồng về quyền của người khuyết tật

## Cơ sở vật chất

- Diện tích: 2000m²
- 15 phòng học hiện đại
- Thư viện sách nói và sách chữ nổi Braille
- Phòng tin học với thiết bị hỗ trợ chuyên dụng
- Khu vực thực hành massage và vật lý trị liệu

## Đội ngũ nhân sự

- 25 giảng viên và chuyên gia
- 10 nhân viên hỗ trợ
- 5 tình nguyện viên thường xuyên

## Thành tựu nổi bật

- Đào tạo thành công hơn 2000 học viên
- Tỷ lệ có việc làm sau tốt nghiệp: 90%
- Nhận nhiều giải thưởng về công tác xã hội

## Liên hệ

**Địa chỉ**: Hải Dương, Việt Nam  
**Điện thoại**: +84 123 456 789  
**Email**: info@ttphcn-haiduong.vn  
**Website**: https://ttphcn-haiduong.vn
      `,
      status: "PUBLISHED",
      type: "PAGE",
      metaTitle: "Giới thiệu - Trung tâm Phục hồi chức năng Hải Dương",
      metaDescription: "Tìm hiểu về lịch sử, sứ mệnh và hoạt động của Trung tâm PHCN Hải Dương",
      publishedAt: new Date("2024-03-10T09:00:00Z"),
      authorId: admin.id,
      featuredImage: "/placeholder.svg?height=400&width=600&text=Giới+thiệu",
    },
  ]

  for (const postData of posts) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    })

    // Add categories and tags
    if (postData.slug.includes("cntt")) {
      await prisma.postCategory.upsert({
        where: {
          postId_categoryId: {
            postId: post.id,
            categoryId: categories[0].id, // Đào tạo
          },
        },
        update: {},
        create: {
          postId: post.id,
          categoryId: categories[0].id,
        },
      })

      await prisma.postTag.upsert({
        where: {
          postId_tagId: {
            postId: post.id,
            tagId: tags[0].id, // CNTT
          },
        },
        update: {},
        create: {
          postId: post.id,
          tagId: tags[0].id,
        },
      })
    }

    if (postData.slug.includes("sinh-ke")) {
      await prisma.postCategory.upsert({
        where: {
          postId_categoryId: {
            postId: post.id,
            categoryId: categories[1].id, // Việc làm
          },
        },
        update: {},
        create: {
          postId: post.id,
          categoryId: categories[1].id,
        },
      })
    }
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

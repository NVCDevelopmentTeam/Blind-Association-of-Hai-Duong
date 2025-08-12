import { fail, redirect } from "@sveltejs/kit"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const actions = {
  create: async ({ request, locals }) => {
    const data = await request.formData()
    const title = data.get("title")
    const slug = data.get("slug")
    const content = data.get("content")
    const excerpt = data.get("excerpt")
    const featuredImage = data.get("featuredImage")
    const status = data.get("status")
    const categoryId = data.get("categoryId")
    const tags = JSON.parse(data.get("tags") || "[]")

    // Validation
    const errors = {}

    if (!title?.trim()) {
      errors.title = "Tiêu đề là bắt buộc"
    }

    if (!slug?.trim()) {
      errors.slug = "Slug là bắt buộc"
    }

    if (!content?.trim() || content === "<p><br></p>") {
      errors.content = "Nội dung là bắt buộc"
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors })
    }

    try {
      // Check if slug already exists
      const existingPost = await prisma.post.findUnique({
        where: { slug: slug.toString() },
      })

      if (existingPost) {
        return fail(400, {
          errors: { slug: "Slug đã tồn tại" },
        })
      }

      // Create post
      const post = await prisma.post.create({
        data: {
          title: title.toString(),
          slug: slug.toString(),
          content: content.toString(),
          excerpt: excerpt?.toString() || null,
          featuredImage: featuredImage?.toString() || null,
          status: status.toString(),
          categoryId: categoryId?.toString() || null,
          authorId: locals.user.id,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          tags: {
            create: tags.map((tagId) => ({ tagId })),
          },
        },
      })

      throw redirect(302, `/admin/posts/${post.id}`)
    } catch (error) {
      console.error("Create post error:", error)
      return fail(500, {
        message: "Lỗi server, vui lòng thử lại sau",
      })
    }
  },
}

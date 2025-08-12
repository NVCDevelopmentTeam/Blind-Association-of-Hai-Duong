import { fail, redirect } from "@sveltejs/kit"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get("email")
    const password = data.get("password")
    const rememberMe = data.get("rememberMe") === "true"

    // Validation
    if (!email || !password) {
      return fail(400, {
        message: "Email và mật khẩu là bắt buộc",
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return fail(400, {
        message: "Email không hợp lệ",
      })
    }

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toString() },
      })

      if (!user) {
        return fail(401, {
          message: "Email hoặc mật khẩu không đúng",
        })
      }

      // Check password
      const validPassword = await bcrypt.compare(password.toString(), user.password)
      if (!validPassword) {
        return fail(401, {
          message: "Email hoặc mật khẩu không đúng",
        })
      }

      // Check if user has admin role
      if (user.role !== "ADMIN" && user.role !== "MODERATOR" && user.role !== "EDITOR") {
        return fail(403, {
          message: "Bạn không có quyền truy cập vào khu vực quản trị",
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: rememberMe ? "30d" : "24h" },
      )

      // Set cookie
      cookies.set("auth-token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      })

      // Redirect to dashboard
      throw redirect(302, "/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      return fail(500, {
        message: "Lỗi server, vui lòng thử lại sau",
      })
    }
  },
}

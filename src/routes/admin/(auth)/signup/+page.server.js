import { fail } from "@sveltejs/kit"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

export const actions = {
  signup: async ({ request }) => {
    const data = await request.formData()
    const username = data.get("username")
    const email = data.get("email")
    const password = data.get("password")
    const confirmPassword = data.get("confirmPassword")

    // Server-side validation
    const errors = {}

    // Username validation
    if (!username || username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.username = "Tên đăng nhập chỉ được chứa chữ cái và số"
    }

    // Email validation
    if (!email) {
      errors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email không hợp lệ"
    }

    // Password validation
    if (!password) {
      errors.password = "Mật khẩu là bắt buộc"
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
      if (!passwordRegex.test(password)) {
        errors.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      }
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, { errors })
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email.toString() }, { name: username.toString() }],
        },
      })

      if (existingUser) {
        return fail(400, {
          message: "Email hoặc tên đăng nhập đã tồn tại",
        })
      }

      // Generate OTP
      const otpCode = crypto.randomInt(100000, 999999).toString()
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

      // Hash password
      const hashedPassword = await bcrypt.hash(password.toString(), 12)

      // Create user (not verified yet)
      const user = await prisma.user.create({
        data: {
          name: username.toString(),
          email: email.toString(),
          password: hashedPassword,
          role: "USER",
          isVerified: false,
          otpCode,
          otpExpiry,
        },
      })

      // In a real app, send OTP via email here
      console.log(`OTP for ${email}: ${otpCode}`)

      return {
        step: "otp",
        email: email.toString(),
        userId: user.id,
      }
    } catch (error) {
      console.error("Signup error:", error)
      return fail(500, {
        message: "Lỗi server, vui lòng thử lại sau",
      })
    }
  },

  "verify-otp": async ({ request }) => {
    const data = await request.formData()
    const otp = data.get("otp")
    const email = data.get("email")

    if (!otp || !email) {
      return fail(400, {
        message: "Thiếu thông tin xác thực",
      })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toString() },
      })

      if (!user) {
        return fail(404, {
          message: "Người dùng không tồn tại",
        })
      }

      if (user.otpCode !== otp.toString()) {
        return fail(400, {
          message: "Mã OTP không đúng",
        })
      }

      if (new Date() > user.otpExpiry) {
        return fail(400, {
          message: "Mã OTP đã hết hạn",
        })
      }

      // Verify user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          otpCode: null,
          otpExpiry: null,
        },
      })

      return {
        success: true,
        message: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.",
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      return fail(500, {
        message: "Lỗi server, vui lòng thử lại sau",
      })
    }
  },
}

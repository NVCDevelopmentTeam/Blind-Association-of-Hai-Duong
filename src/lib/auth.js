import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function verifyAuth(cookies) {
  const token = cookies.get("auth-token")

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    // Get fresh user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    })

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}

export function requireAuth(user, allowedRoles = ["ADMIN", "MODERATOR", "EDITOR"]) {
  if (!user) {
    return false
  }

  return allowedRoles.includes(user.role)
}

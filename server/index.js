import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
})

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "hai-duong-cms-secret-key-2024"

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mp3/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Invalid file type"))
    }
  },
})

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" })
    req.user = user
    next()
  })
}

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email không hợp lệ. Vui lòng nhập đúng định dạng email có chứa ký tự @.",
      })
    }

    // Validate password requirements
    const passwordErrors = []
    if (!password || password.length < 8) {
      passwordErrors.push("Mật khẩu phải có ít nhất 8 ký tự")
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("Mật khẩu phải có ít nhất 1 chữ hoa")
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push("Mật khẩu phải có ít nhất 1 chữ thường")
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push("Mật khẩu phải có ít nhất 1 số")
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      passwordErrors.push("Mật khẩu phải có ít nhất 1 ký tự đặc biệt")
    }

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        error: passwordErrors.join(". "),
      })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.",
      })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: rememberMe ? "30d" : "24h",
      },
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Lỗi server. Vui lòng thử lại sau." })
  }
})

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({
        error: "Không tìm thấy tài khoản với email này.",
      })
    }

    // In a real app, you would send an email with reset link
    res.json({
      message: "Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ error: "Lỗi server. Vui lòng thử lại sau." })
  }
})

app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

// Posts routes
app.get("/api/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, status = "PUBLISHED", type = "POST", search, featured } = req.query

    const where = {
      status,
      type,
      ...(category && {
        categories: {
          some: {
            category: {
              slug: category,
            },
          },
        },
      }),
      ...(tag && {
        tags: {
          some: {
            tag: {
              slug: tag,
            },
          },
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: Number.parseInt(limit),
    })

    const total = await prisma.post.count({ where })

    res.json({
      posts,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.get("/api/posts/:slug", async (req, res) => {
  try {
    const { slug } = req.params

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, bio: true },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: { status: "APPROVED" },
          include: {
            author: {
              select: { id: true, name: true, avatar: true },
            },
            replies: {
              include: {
                author: {
                  select: { id: true, name: true, avatar: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" })
    }

    res.json(post)
  } catch (error) {
    console.error("Get post error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Admin routes
app.get("/api/admin/posts", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: Number.parseInt(limit),
    })

    const total = await prisma.post.count({ where })

    res.json({
      posts,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get admin posts error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.post("/api/admin/posts", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status = "DRAFT",
      type = "POST",
      metaTitle,
      metaDescription,
      publishedAt,
      categories = [],
      tags = [],
    } = req.body

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status,
        type,
        metaTitle,
        metaDescription,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        authorId: req.user.userId,
        categories: {
          create: categories.map((categoryId) => ({
            categoryId,
          })),
        },
        tags: {
          create: tags.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    res.status(201).json(post)
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.put("/api/admin/posts/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status,
      type,
      metaTitle,
      metaDescription,
      publishedAt,
      categories = [],
      tags = [],
    } = req.body

    // Delete existing relationships
    await prisma.postCategory.deleteMany({ where: { postId: id } })
    await prisma.postTag.deleteMany({ where: { postId: id } })

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status,
        type,
        metaTitle,
        metaDescription,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        categories: {
          create: categories.map((categoryId) => ({
            categoryId,
          })),
        },
        tags: {
          create: tags.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    res.json(post)
  } catch (error) {
    console.error("Update post error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.delete("/api/admin/posts/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.post.delete({
      where: { id },
    })

    res.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Categories routes
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    })

    res.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.post("/api/admin/categories", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, color } = req.body

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color,
      },
    })

    res.status(201).json(category)
  } catch (error) {
    console.error("Create category error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Tags routes
app.get("/api/tags", async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    })

    res.json(tags)
  } catch (error) {
    console.error("Get tags error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.post("/api/admin/tags", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, slug, color } = req.body

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color,
      },
    })

    res.status(201).json(tag)
  } catch (error) {
    console.error("Create tag error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Media upload
app.post("/api/admin/upload", authenticateToken, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được tải lên" })
    }

    const media = await prisma.media.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
      },
    })

    res.json(media)
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.get("/api/admin/media", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    })

    res.json(media)
  } catch (error) {
    console.error("Get media error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Settings routes
app.get("/api/admin/settings", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.setting.findMany()
    const settingsObj = {}

    settings.forEach((setting) => {
      let value = setting.value
      if (setting.type === "BOOLEAN") {
        value = value === "true"
      } else if (setting.type === "NUMBER") {
        value = Number.parseFloat(value)
      } else if (setting.type === "JSON") {
        value = JSON.parse(value)
      }
      settingsObj[setting.key] = value
    })

    res.json(settingsObj)
  } catch (error) {
    console.error("Get settings error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.put("/api/admin/settings", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = req.body

    for (const [key, value] of Object.entries(settings)) {
      let type = "STRING"
      let stringValue = String(value)

      if (typeof value === "boolean") {
        type = "BOOLEAN"
        stringValue = String(value)
      } else if (typeof value === "number") {
        type = "NUMBER"
        stringValue = String(value)
      } else if (typeof value === "object") {
        type = "JSON"
        stringValue = JSON.stringify(value)
      }

      await prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type },
      })
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Update settings error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Statistics
app.get("/api/admin/statistics", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalPosts, totalUsers, todayVisitors, totalVisitors, activeChatSessions] = await Promise.all([
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
      prisma.visitor.count({ where: { createdAt: { gte: today } } }),
      prisma.visitor.count(),
      prisma.chatSession.count({ where: { status: "ACTIVE" } }),
    ])

    res.json({
      totalPosts,
      totalUsers,
      todayVisitors,
      totalVisitors,
      activeChatSessions,
    })
  } catch (error) {
    console.error("Get statistics error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Visitor tracking
app.post("/api/track-visitor", async (req, res) => {
  try {
    const { page, referrer } = req.body
    const ip = req.ip || req.connection.remoteAddress
    const userAgent = req.headers["user-agent"]

    await prisma.visitor.create({
      data: {
        ip,
        userAgent,
        page,
        referrer,
      },
    })

    res.json({ success: true })
  } catch (error) {
    console.error("Track visitor error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Chat system with Socket.io
const activeChatSessions = new Map()
const adminSockets = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Join chat session
  socket.on("join-chat", async (data) => {
    const { sessionId, userId, isAdmin } = data

    socket.join(sessionId)

    if (isAdmin) {
      adminSockets.set(socket.id, { sessionId, userId })
    }

    // Get or create chat session
    let session = await prisma.chatSession.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    })

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          sessionId,
          userId,
        },
        include: {
          messages: true,
        },
      })
    }

    socket.emit("chat-history", session.messages)
  })

  // Handle chat messages
  socket.on("send-message", async (data) => {
    const { sessionId, content, userId, isAdmin, type = "TEXT" } = data

    try {
      // Save message to database
      const message = await prisma.chatMessage.create({
        data: {
          content,
          type,
          isFromUser: !isAdmin,
          isFromAdmin: isAdmin,
          sessionId,
          userId,
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      })

      // Broadcast message to all users in the session
      io.to(sessionId).emit("new-message", message)

      // If user message and no admin in session, try AI response
      if (!isAdmin && !activeChatSessions.get(sessionId)?.hasAdmin) {
        setTimeout(async () => {
          const aiResponse = await generateAIResponse(content)

          if (aiResponse.needsAdmin) {
            // Escalate to admin
            await prisma.chatSession.update({
              where: { sessionId },
              data: {
                status: "WAITING_ADMIN",
                isWithAdmin: true,
              },
            })

            // Notify admins
            adminSockets.forEach((adminData, socketId) => {
              io.to(socketId).emit("admin-notification", {
                type: "new-chat-request",
                sessionId,
                message: "Có yêu cầu hỗ trợ mới từ khách hàng",
              })
            })

            const systemMessage = await prisma.chatMessage.create({
              data: {
                content:
                  "Câu hỏi của bạn cần được hỗ trợ trực tiếp. Chúng tôi đang kết nối bạn với nhân viên tư vấn...",
                type: "SYSTEM",
                isFromUser: false,
                isFromAdmin: false,
                sessionId,
              },
            })

            io.to(sessionId).emit("new-message", systemMessage)
          } else {
            const aiMessage = await prisma.chatMessage.create({
              data: {
                content: aiResponse.message,
                type: "TEXT",
                isFromUser: false,
                isFromAdmin: false,
                sessionId,
              },
            })

            io.to(sessionId).emit("new-message", aiMessage)
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Send message error:", error)
      socket.emit("error", { message: "Không thể gửi tin nhắn" })
    }
  })

  // Admin joins chat
  socket.on("admin-join-chat", async (data) => {
    const { sessionId, adminId } = data

    await prisma.chatSession.update({
      where: { sessionId },
      data: {
        status: "ACTIVE",
        adminId,
        isWithAdmin: true,
      },
    })

    activeChatSessions.set(sessionId, { hasAdmin: true, adminId })

    const systemMessage = await prisma.chatMessage.create({
      data: {
        content: "Nhân viên tư vấn đã tham gia cuộc trò chuyện",
        type: "SYSTEM",
        isFromUser: false,
        isFromAdmin: false,
        sessionId,
      },
    })

    io.to(sessionId).emit("new-message", systemMessage)
    io.to(sessionId).emit("admin-joined")
  })

  // Video call request
  socket.on("request-video-call", (data) => {
    const { sessionId, userId } = data
    io.to(sessionId).emit("video-call-request", { userId })
  })

  // Voice call request
  socket.on("request-voice-call", (data) => {
    const { sessionId, userId } = data
    io.to(sessionId).emit("voice-call-request", { userId })
  })

  // File upload in chat
  socket.on("upload-file", async (data) => {
    const { sessionId, fileData, fileName, fileType } = data

    // Save file and create message
    const message = await prisma.chatMessage.create({
      data: {
        content: fileName,
        type: "FILE",
        isFromUser: true,
        isFromAdmin: false,
        sessionId,
      },
    })

    io.to(sessionId).emit("new-message", message)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
    adminSockets.delete(socket.id)
  })
})

// AI Response Generator
async function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase()

  // Simple AI logic - in a real app, you'd use a proper AI service
  if (lowerMessage.includes("đào tạo") || lowerMessage.includes("khóa học")) {
    return {
      message:
        "Chúng tôi có nhiều khóa đào tạo nghề như CNTT, massage, thủ công mỹ nghệ. Bạn quan tâm đến lĩnh vực nào?",
      needsAdmin: false,
    }
  } else if (lowerMessage.includes("việc làm") || lowerMessage.includes("tuyển dụng")) {
    return {
      message:
        'Trung tâm thường xuyên cập nhật thông tin việc làm phù hợp với người khiếm thị. Bạn có thể xem tại mục "Việc làm" hoặc liên hệ trực tiếp.',
      needsAdmin: false,
    }
  } else if (lowerMessage.includes("liên hệ") || lowerMessage.includes("địa chỉ")) {
    return {
      message:
        "Bạn có thể liên hệ với chúng tôi qua số điện thoại: +84 123 456 789 hoặc email: info@ttphcn-haiduong.vn",
      needsAdmin: false,
    }
  } else if (lowerMessage.includes("phục hồi")) {
    return {
      message:
        "Chúng tôi cung cấp các dịch vụ phục hồi chức năng toàn diện, bao gồm định hướng di chuyển, kỹ năng sống độc lập và hỗ trợ tâm lý.",
      needsAdmin: false,
    }
  } else if (lowerMessage.includes("giá") || lowerMessage.includes("chi phí") || lowerMessage.includes("học phí")) {
    return {
      message: "Để biết thông tin chi tiết về học phí và chi phí các dịch vụ, tôi sẽ kết nối bạn với nhân viên tư vấn.",
      needsAdmin: true,
    }
  } else if (lowerMessage.includes("đăng ký") || lowerMessage.includes("tham gia")) {
    return {
      message: "Để được hỗ trợ đăng ký tham gia các chương trình, tôi sẽ kết nối bạn với nhân viên tư vấn.",
      needsAdmin: true,
    }
  } else {
    return {
      message: "Tôi cần kết nối bạn với nhân viên tư vấn để được hỗ trợ tốt nhất.",
      needsAdmin: true,
    }
  }
}

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Initialize default data
async function initializeData() {
  try {
    // Create default admin user
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin123!", 10)
      await prisma.user.create({
        data: {
          email: "admin@ttphcn-haiduong.vn",
          password: hashedPassword,
          name: "Quản trị viên",
          role: "ADMIN",
        },
      })
      console.log("Default admin user created")
    }

    // Create default categories
    const categories = [
      { name: "Đào tạo", slug: "dao-tao", description: "Các chương trình đào tạo nghề", color: "#3B82F6" },
      { name: "Việc làm", slug: "viec-lam", description: "Thông tin việc làm và tuyển dụng", color: "#10B981" },
      { name: "Hoạt động", slug: "hoat-dong", description: "Các hoạt động của trung tâm", color: "#F59E0B" },
      { name: "Hỗ trợ", slug: "ho-tro", description: "Dịch vụ hỗ trợ người khiếm thị", color: "#EF4444" },
      { name: "Tin tức", slug: "tin-tuc", description: "Tin tức và thông báo", color: "#8B5CF6" },
    ]

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      })
    }

    // Create default tags
    const tags = [
      { name: "CNTT", slug: "cntt", color: "#3B82F6" },
      { name: "Massage", slug: "massage", color: "#10B981" },
      { name: "Thủ công", slug: "thu-cong", color: "#F59E0B" },
      { name: "Tư vấn", slug: "tu-van", color: "#EF4444" },
      { name: "Phục hồi", slug: "phuc-hoi", color: "#8B5CF6" },
    ]

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      })
    }

    // Create default settings
    const defaultSettings = [
      {
        key: "site_name",
        value: "Trung tâm Phục hồi chức năng và Giáo dục nghề nghiệp cho Người mù Hải Dương",
        type: "STRING",
      },
      { key: "site_description", value: "Nơi hỗ trợ, đào tạo và tạo việc làm cho người khiếm thị", type: "STRING" },
      { key: "contact_email", value: "info@ttphcn-haiduong.vn", type: "STRING" },
      { key: "contact_phone", value: "+84 123 456 789", type: "STRING" },
      { key: "address", value: "Hải Dương, Việt Nam", type: "STRING" },
      { key: "facebook_url", value: "https://facebook.com", type: "STRING" },
      { key: "youtube_url", value: "https://youtube.com", type: "STRING" },
      { key: "twitter_url", value: "https://twitter.com", type: "STRING" },
      { key: "enable_registration", value: "true", type: "BOOLEAN" },
      { key: "enable_comments", value: "true", type: "BOOLEAN" },
      { key: "maintenance_mode", value: "false", type: "BOOLEAN" },
      { key: "default_locale", value: "vi", type: "STRING" },
    ]

    for (const setting of defaultSettings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      })
    }

    console.log("Default data initialized")
  } catch (error) {
    console.error("Initialize data error:", error)
  }
}

initializeData()

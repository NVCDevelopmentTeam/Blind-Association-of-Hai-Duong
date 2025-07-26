import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST"],
  },
})

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp3|mp4|webm/
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
    return res.sendStatus(401)
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" })
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

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
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: "Email không tồn tại trong hệ thống" })
    }

    // In a real app, you would send an email here
    res.json({ message: "Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn." })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Posts routes
app.get("/api/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "PUBLISHED", category, tag } = req.query
    const skip = (page - 1) * limit

    const where = {
      status: status,
      ...(category && { category: { slug: category } }),
      ...(tag && { tags: { some: { tag: { slug: tag } } } }),
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true } },
        category: true,
        tags: { include: { tag: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: Number.parseInt(skip),
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
        author: { select: { name: true } },
        category: true,
        tags: { include: { tag: true } },
        comments: {
          where: { status: "APPROVED" },
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!post) {
      return res.status(404).json({ error: "Bài viết không tồn tại" })
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })

    res.json(post)
  } catch (error) {
    console.error("Get post error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Categories routes
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: "asc" },
    })

    res.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Tags routes
app.get("/api/tags", async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: "asc" },
    })

    res.json(tags)
  } catch (error) {
    console.error("Get tags error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

// Admin routes
app.get("/api/admin/statistics", authenticateToken, async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalPosts, totalUsers, todayVisitors, totalVisitors, activeChatSessions] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.visitor.count({ where: { createdAt: { gte: today } } }),
      prisma.visitor.count(),
      prisma.chatSession.count({ where: { isActive: true } }),
    ])

    res.json({
      totalPosts,
      totalUsers,
      todayVisitors,
      totalVisitors,
      activeChatSessions,
      onlineUsers: io.engine.clientsCount,
    })
  } catch (error) {
    console.error("Get statistics error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.get("/api/admin/posts", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true } },
        category: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: Number.parseInt(skip),
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

app.post("/api/admin/posts", authenticateToken, async (req, res) => {
  try {
    const { title, slug, content, excerpt, featuredImage, status, categoryId, tags } = req.body

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status,
        categoryId,
        authorId: req.user.userId,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        tags: {
          create: tags?.map((tagId) => ({ tagId })) || [],
        },
      },
      include: {
        author: { select: { name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    })

    res.status(201).json(post)
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.put("/api/admin/posts/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, content, excerpt, featuredImage, status, categoryId, tags } = req.body

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        status,
        categoryId,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        tags: {
          deleteMany: {},
          create: tags?.map((tagId) => ({ tagId })) || [],
        },
      },
      include: {
        author: { select: { name: true } },
        category: true,
        tags: { include: { tag: true } },
      },
    })

    res.json(post)
  } catch (error) {
    console.error("Update post error:", error)
    res.status(500).json({ error: "Lỗi server" })
  }
})

app.delete("/api/admin/posts/:id", authenticateToken, async (req, res) => {
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

// File upload route
app.post("/api/admin/upload", authenticateToken, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được tải lên" })
    }

    const fileUrl = `/uploads/${req.file.filename}`
    res.json({ url: fileUrl, filename: req.file.filename })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "Lỗi tải file" })
  }
})

// Visitor tracking
app.post("/api/track-visitor", async (req, res) => {
  try {
    const { page, referrer } = req.body
    const ip = req.ip || req.connection.remoteAddress
    const userAgent = req.get("User-Agent")

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

// Socket.io for real-time features
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-chat", async (data) => {
    const { sessionId, userId, isAdmin } = data

    try {
      let chatSession = await prisma.chatSession.findUnique({
        where: { sessionId },
      })

      if (!chatSession) {
        chatSession = await prisma.chatSession.create({
          data: {
            sessionId,
            userId,
            isActive: true,
          },
        })
      }

      socket.join(sessionId)

      // Send chat history
      const messages = await prisma.chatMessage.findMany({
        where: { sessionId: chatSession.id },
        orderBy: { createdAt: "asc" },
      })

      socket.emit("chat-history", messages)

      if (isAdmin) {
        // Notify user that admin joined
        socket.to(sessionId).emit("admin-joined")

        // Update session to show admin connected
        await prisma.chatSession.update({
          where: { id: chatSession.id },
          data: { connectedToAdmin: true },
        })
      }
    } catch (error) {
      console.error("Join chat error:", error)
    }
  })

  socket.on("send-message", async (data) => {
    const { sessionId, content, userId, isAdmin, type = "TEXT" } = data

    try {
      const chatSession = await prisma.chatSession.findUnique({
        where: { sessionId },
      })

      if (!chatSession) return

      const message = await prisma.chatMessage.create({
        data: {
          content,
          type,
          isFromUser: !isAdmin,
          isFromAdmin: isAdmin,
          sessionId: chatSession.id,
        },
      })

      // Broadcast message to all users in the session
      io.to(sessionId).emit("new-message", message)

      // If message is from user and no admin is connected, try AI response
      if (!isAdmin && !chatSession.connectedToAdmin) {
        setTimeout(async () => {
          const aiResponse = generateAIResponse(content)

          if (aiResponse.needsHuman) {
            // Notify admins about new chat session needing attention
            socket.broadcast.emit("admin-notification", {
              type: "chat-request",
              message: "Người dùng cần hỗ trợ từ nhân viên tư vấn",
              sessionId,
              timestamp: new Date(),
            })
          } else {
            const aiMessage = await prisma.chatMessage.create({
              data: {
                content: aiResponse.message,
                type: "TEXT",
                isFromUser: false,
                isFromAdmin: false,
                sessionId: chatSession.id,
              },
            })

            io.to(sessionId).emit("new-message", aiMessage)
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Send message error:", error)
    }
  })

  socket.on("request-video-call", (data) => {
    const { sessionId } = data
    socket.to(sessionId).emit("video-call-request")
  })

  socket.on("request-voice-call", (data) => {
    const { sessionId } = data
    socket.to(sessionId).emit("voice-call-request")
  })

  socket.on("upload-file", async (data) => {
    const { sessionId, fileData, fileName, fileType } = data

    try {
      const chatSession = await prisma.chatSession.findUnique({
        where: { sessionId },
      })

      if (!chatSession) return

      const message = await prisma.chatMessage.create({
        data: {
          content: `File: ${fileName}`,
          type: "FILE",
          isFromUser: true,
          isFromAdmin: false,
          sessionId: chatSession.id,
        },
      })

      io.to(sessionId).emit("new-message", message)
    } catch (error) {
      console.error("Upload file error:", error)
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// AI Response Generator
function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase()

  const responses = {
    "đào tạo": {
      message:
        "Chúng tôi có nhiều khóa đào tạo nghề như CNTT, massage, thủ công mỹ nghệ. Bạn quan tâm đến lĩnh vực nào?",
      needsHuman: false,
    },
    "việc làm": {
      message:
        'Trung tâm thường xuyên cập nhật thông tin việc làm phù hợp với người khiếm thị. Bạn có thể xem tại mục "Việc làm" hoặc liên hệ trực tiếp.',
      needsHuman: false,
    },
    "liên hệ": {
      message: "Bạn có thể liên hệ qua số điện thoại: +84 123 456 789 hoặc email: info@ttphcn-haiduong.vn",
      needsHuman: false,
    },
    "phục hồi": {
      message:
        "Chúng tôi cung cấp các dịch vụ phục hồi chức năng toàn diện, bao gồm định hướng di chuyển, kỹ năng sống độc lập.",
      needsHuman: false,
    },
  }

  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }

  // If no keyword matches, escalate to human
  return {
    message: "Tôi sẽ kết nối bạn với nhân viên tư vấn để được hỗ trợ tốt nhất.",
    needsHuman: true,
  }
}

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

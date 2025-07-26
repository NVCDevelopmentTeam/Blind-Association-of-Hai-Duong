import { json } from "@sveltejs/kit"

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: "Administrator",
    email: "admin@ttphcn-haiduong.vn",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    email: "user@example.com",
    role: "user",
    createdAt: "2024-02-15T10:30:00Z",
  },
  {
    id: 3,
    name: "Trần Thị B",
    email: "user2@example.com",
    role: "user",
    createdAt: "2024-03-01T14:20:00Z",
  },
]

export async function GET() {
  return json(mockUsers)
}

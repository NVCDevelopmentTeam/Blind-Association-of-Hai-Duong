import { json } from "@sveltejs/kit"

export async function POST({ request, getClientAddress }) {
  try {
    const { page, referrer } = await request.json()
    const ip = getClientAddress()
    const userAgent = request.headers.get("user-agent")

    // In a real app, you would save this to a database
    console.log("Visitor tracked:", {
      ip,
      userAgent,
      page,
      referrer,
      timestamp: new Date().toISOString(),
    })

    return json({ success: true })
  } catch (error) {
    console.error("Track visitor error:", error)
    return json({ error: "Failed to track visitor" }, { status: 500 })
  }
}

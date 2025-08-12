import { redirect } from "@sveltejs/kit"
import { verifyAuth, requireAuth } from "$lib/auth.js"

export async function load({ cookies }) {
  const user = await verifyAuth(cookies)

  if (!user || !requireAuth(user)) {
    throw redirect(302, "/admin/login")
  }

  return {
    user,
  }
}

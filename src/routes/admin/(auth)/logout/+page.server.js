import { redirect } from "@sveltejs/kit"

export async function load({ cookies }) {
  // Clear the auth token
  cookies.delete("auth-token", { path: "/" })

  // Redirect to login page
  throw redirect(302, "/admin/login")
}

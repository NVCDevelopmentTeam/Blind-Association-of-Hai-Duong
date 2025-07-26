import { writable } from "svelte/store"
import { browser } from "$app/environment"

function createAuthStore() {
  const { subscribe, set, update } = writable({
    isAuthenticated: false,
    user: null,
    token: null,
  })

  return {
    subscribe,
    login: (token, user = null) => {
      if (browser) {
        localStorage.setItem("token", token)
      }
      set({
        isAuthenticated: true,
        user,
        token,
      })
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem("token")
      }
      set({
        isAuthenticated: false,
        user: null,
        token: null,
      })
    },
    updateUser: (user) => {
      update((state) => ({
        ...state,
        user,
      }))
    },
  }
}

export const authStore = createAuthStore()

import { browser } from "$app/environment"
import { init, register } from "svelte-i18n"

const defaultLocale = "vi"

register("vi", () => import("./locales/vi.json"))
register("en", () => import("./locales/en.json"))

init({
  fallbackLocale: defaultLocale,
  initialLocale: browser ? window.navigator.language.split("-")[0] : defaultLocale,
})

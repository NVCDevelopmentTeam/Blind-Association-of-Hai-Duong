import { register, init, getLocaleFromNavigator, locale } from "svelte-i18n"

const MESSAGE_FILE_URL_TEMPLATE = "/lang/{locale}.json"

register("vi", () => import("../locales/vi.json"))
register("en", () => import("../locales/en.json"))

init({
  fallbackLocale: "vi",
  initialLocale: getLocaleFromNavigator(),
})

export { locale }

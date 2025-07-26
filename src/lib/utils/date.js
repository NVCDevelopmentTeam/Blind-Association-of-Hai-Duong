/**
 * @param {string | number | Date} dateString
 * @param {string} [locale]
 */
export function formatDate(dateString, locale = "vi-VN") {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/**
 * @param {string | number | Date} dateString
 * @param {string} [locale]
 */
export function formatRelativeTime(dateString, locale = "vi-VN") {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second")
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute")
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour")
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day")
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month")
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year")
  }
}

/**
 * @param {string | number | Date} dateString
 */
export function isToday(dateString) {
  const date = new Date(dateString)
  const today = new Date()

  return date.toDateString() === today.toDateString()
}

/**
 * @param {string | number | Date} dateString
 */
export function isThisWeek(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  return date >= weekAgo && date <= today
}

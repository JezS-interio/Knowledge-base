export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const min = Math.round(diff / 60000)
  if (min < 1) return "just now"
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`
  const hours = Math.round(min / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.round(hours / 24)
  if (days === 1) return "yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`
  const years = Math.round(months / 12)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** Alias kept for compatibility. */
export const formatRelative = relativeTime

/** Low-opacity tinted background from an oklch color, for accent chips. */
export function tint(color: string, pct = 12): string {
  return `color-mix(in oklch, ${color} ${pct}%, transparent)`
}

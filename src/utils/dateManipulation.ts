export function parseISO8601Date(dateString: string): Date {
  const year = parseInt(dateString.slice(0, 4), 10)
  const month = parseInt(dateString.slice(4, 6), 10) - 1
  const day = parseInt(dateString.slice(6, 8), 10)
  const hour = parseInt(dateString.slice(9, 11), 10)
  const minute = parseInt(dateString.slice(11, 13), 10)
  const second = parseInt(dateString.slice(13, 15), 10)

  const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second))
  return utcDate
}
export const isSameDay = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

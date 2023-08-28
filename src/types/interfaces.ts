interface ICSOrganizer {
  OWNER: string
  MAIL: string
}
export interface ICSFormat {
  UID: string
  DESCRIPTION: string
  DTEND: string
  DTSTART: string
  DTSTAMP: string
  LOCATION: string
  SUMMARY: string
  CN: ICSOrganizer
}
export interface CalendarDay {
  day: number | string
  inCurrentMonth: boolean
  dayOfWeek: string
  isToday?: boolean
  events: ICSFormat[]
}

interface ICSOrganizer {
  CN: string
  mailto: string
}
export interface ICSFormat {
  UID: string
  DESCRIPTION: string
  DTEND: string
  DTSTART: string
  DTSTAMP: string
  LOCATION: string
  SUMMARY: string
  ORGANIZER: ICSOrganizer
}

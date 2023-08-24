import type { ICSFormat } from './types/interfaces'

export const parseFromICS = (icsData: string): ICSFormat[] => {
  const events = icsData.split('BEGIN:VEVENT')
  const parsedEvents: ICSFormat[] = []

  for (const event of events) {
    const lines = event.split('\n').filter(line => !!line && !line.startsWith('END'))
    const parsedEvent: any = {}

    for (const line of lines) {
      if (line.startsWith('ORGANIZER')) {
        const organizerData = line.split(';')[1]
        const [key, value] = organizerData.split('=')
        parsedEvent[key] = { OWNER: value.split(':')[0], MAIL: value.split(':')[2] }
      } else {
        const [key, value] = line.split(':')
        parsedEvent[key] = value
      }
    }

    parsedEvents.push(parsedEvent)
  }
  parsedEvents.shift()
  return parsedEvents
}
export const parseToICF = (obj: ICSFormat[], filename?: string) => {
  let ICSFile = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Example Corp//iCal 1.0//EN

`
  obj.forEach(el => {
    ICSFile += `
BEGIN:VEVENT
UID:${el.UID}
DTSTAMP:${el.DTSTAMP}
ORGANIZER;CN=${el.CN.OWNER}:mailto:${el.CN.MAIL}
DTSTART:${el.DTSTART}
DTEND:${el.DTEND}
SUMMARY:${el.SUMMARY}
DESCRIPTION:${el.DESCRIPTION}
LOCATION:${el.LOCATION}
END:VEVENT

    `
  })

  ICSFile += 'END:VCALENDAR'
  const link = document.createElement('a')
  const file = new Blob([ICSFile], { type: 'text/plain' })
  link.href = URL.createObjectURL(file)
  link.download = `${filename}.ics`
  link.click()
  URL.revokeObjectURL(link.href)
}

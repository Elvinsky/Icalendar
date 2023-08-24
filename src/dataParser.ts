import type { ICSFormat } from './types/interfaces'

const data = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Example Corp//iCal 1.0//EN

BEGIN:VEVENT
UID:9876543210
DTSTAMP:20230824T080000Z
ORGANIZER;CN=Nick:mailto:nick@example.com
DTSTART:20230826T100000Z
DTEND:20230826T120000Z
SUMMARY:Meeting with Client
DESCRIPTION:Discuss project requirements and timelines.
LOCATION:Office
END:VEVENT

BEGIN:VEVENT
UID:5678901234
DTSTAMP:20230824T160000Z
ORGANIZER;CN=Nick:mailto:nick@example.com
DTSTART:20230827T090000Z
DTEND:20230827T110000Z
SUMMARY:Coding Session
DESCRIPTION:Work on new Vue.js component for project.
LOCATION:Home office
END:VEVENT

BEGIN:VEVENT
UID:3456789012
DTSTAMP:20230824T200000Z
ORGANIZER;CN=Nick:mailto:nick@example.com
DTSTART:20230828T140000Z
DTEND:20230828T160000Z
SUMMARY:Team Sync
DESCRIPTION:Weekly sync-up with development team.
LOCATION:Video conference
END:VEVENT

END:VCALENDAR`

export const dataParser = () => {
  const dataParsed: ICSFormat[] = data
    .split('BEGIN:VEVENT')
    .map(el => el.split('\n'))
    .map(el =>
      el.filter(el => {
        if (!el || el.startsWith('END')) return false
        return true
      })
    )
    .map(el =>
      el.map(el => {
        if (el.startsWith('ORGANIZER')) {
          return [
            el.split(';')[0],
            Object.fromEntries([
              [el.split(';')[1].split('=')[0], el.split(';')[1].split('=')[1].split(':')[0]],
              [el.split(';')[1].split('=')[1].split(':')[1], el.split(';')[1].split('=')[1].split(':')[2]]
            ])
          ]
        }
        return el.split(':')
      })
    )
    .map(el =>
      el.reduce((result, [key, value]) => {
        result[key] = value
        return result
      }, {})
    ) as ICSFormat[]
  dataParsed.shift()
  console.log(dataParsed)
}

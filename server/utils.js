/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync } = require('fs')

const readICSFile = icsData => {
  const events = icsData.split('BEGIN:VEVENT')
  const parsedEvents = []

  for (const event of events) {
    const lines = event.split('\n').filter(line => !!line && !line.startsWith('END'))
    const parsedEvent = {}

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

module.exports = { readICSFile }

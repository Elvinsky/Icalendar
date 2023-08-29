/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const db = require('./db')
const ICSFormat = require('./models/ICSModel')
const { readICSFile } = require('./utils')

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../dist')))
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    optionsSuccessStatus: 200
  })
)

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.post('/api/upload-ics-file', upload.single('icsFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded')
    }
    const icsContent = req.file.buffer.toString('utf-8')
    const eventDataArray = readICSFile(icsContent)

    const existingEvents = await ICSFormat.find({}, 'DESCRIPTION DTSTAMP')

    const newEvents = []

    for (const eventData of eventDataArray) {
      const isEventExisting = existingEvents.some(
        existingEvent =>
          existingEvent.DESCRIPTION === eventData.DESCRIPTION && existingEvent.DTSTAMP === eventData.DTSTAMP
      )

      if (!isEventExisting) {
        const newEvent = new ICSFormat({
          UID: eventData.UID,
          DESCRIPTION: eventData.DESCRIPTION,
          DTEND: eventData.DTEND,
          DTSTART: eventData.DTSTART,
          DTSTAMP: eventData.DTSTAMP,
          LOCATION: eventData.LOCATION,
          SUMMARY: eventData.SUMMARY,
          CN: {
            OWNER: eventData.CN.OWNER,
            MAIL: eventData.CN.MAIL
          }
        })

        newEvents.push(newEvent)
      }
    }

    if (newEvents.length > 0) {
      await ICSFormat.insertMany(newEvents)
    }
    res.send(newEvents)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error uploading file')
  }
})
app.post('/api/add-event', async (req, res) => {
  try {
    const eventData = req.body

    const newEvent = new ICSFormat({
      UID: eventData.UID,
      DESCRIPTION: eventData.DESCRIPTION,
      DTEND: eventData.DTEND,
      DTSTART: eventData.DTSTART,
      DTSTAMP: eventData.DTSTAMP,
      LOCATION: eventData.LOCATION,
      SUMMARY: eventData.SUMMARY,
      CN: {
        OWNER: eventData.CN.OWNER,
        MAIL: eventData.CN.MAIL
      }
    })
    await newEvent.save()

    res.status(201).json(newEvent)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error adding event')
  }
})
app.patch('/api/update-event/:uid', async (req, res) => {
  try {
    const uid = req.params.uid
    const eventData = req.body
    console.log(uid, eventData)
    const updatedEvent = await ICSFormat.findOneAndUpdate(
      { UID: uid },
      {
        DESCRIPTION: eventData.DESCRIPTION,
        DTEND: eventData.DTEND,
        DTSTART: eventData.DTSTART,
        DTSTAMP: eventData.DTSTAMP,
        LOCATION: eventData.LOCATION,
        SUMMARY: eventData.SUMMARY,
        CN: {
          OWNER: eventData.CN.OWNER,
          MAIL: eventData.CN.MAIL
        }
      },
      { new: true } // Return the updated document
    )

    if (!updatedEvent) {
      return res.status(404).send('Event not found')
    }

    res.json(updatedEvent)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating event')
  }
})

app.get('/api/get-events', async (req, res) => {
  try {
    const events = await ICSFormat.find({}, '-_id')
    res.json(events)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error retrieving events')
  }
})
app.delete('/api/delete-event/:uid', async (req, res) => {
  try {
    const uidToDelete = req.params.uid

    const deletedEvent = await ICSFormat.findOneAndDelete({ UID: uidToDelete })

    if (!deletedEvent) {
      return res.status(404).send('Event not found')
    }

    res.send('Event deleted successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error deleting event')
  }
})
app.delete('/api/delete-all-events', async (req, res) => {
  //TESTING PORPOSE ONLY
  try {
    await ICSFormat.deleteMany({})
    res.send('All events deleted from the database')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error deleting events')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

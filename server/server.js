/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const { readICSFile } = require('./utils')

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../dist')))
app.use(
  cors({
    origin: 'http://localhost:5173', // Adjust this to your client's origin
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
  })
)

const storage = multer.memoryStorage()
const upload = multer({ storage })

app.post('/api/upload-ics', upload.single('icsFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded')
    }

    const icsContent = req.file.buffer.toString('utf-8')

    // Now you can use the 'icsContent' for further processing
    // For example, you can pass it to your 'readICSFile' function

    // const parsedData = readICSFile(icsContent);
    // res.send(parsedData);
    const parsedData = readICSFile(icsContent)
    res.send(parsedData)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error uploading file')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

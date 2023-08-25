/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const app = express()
const path = require('path')
const { readICSFile } = require('./utils')

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../dist')))

app.get('/api/read-ics', (req, res) => {
  const isServerAvailable = true

  if (isServerAvailable) {
    res.send('Server is available')
  } else {
    res.status(500).send('Server is not available')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

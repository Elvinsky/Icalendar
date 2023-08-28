/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose')

const icsOrganizerSchema = new mongoose.Schema({
  OWNER: String,
  MAIL: String
})

const icsFormatSchema = new mongoose.Schema({
  UID: String,
  DESCRIPTION: String,
  DTEND: String,
  DTSTART: String,
  DTSTAMP: String,
  LOCATION: String,
  SUMMARY: String,
  CN: icsOrganizerSchema
})

const ICSFormat = mongoose.model('ICSFormat', icsFormatSchema)

module.exports = ICSFormat

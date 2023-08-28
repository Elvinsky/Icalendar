/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://Senator:_18082004_@innocalclaster.eyy4cd5.mongodb.net/' // Adjust as needed

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB')
})

module.exports = db

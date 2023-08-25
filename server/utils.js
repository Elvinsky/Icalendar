/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync } = require('fs')

const readICSFile = filePath => {
  try {
    const fileData = readFileSync(filePath, 'utf-8')
    return fileData
  } catch (error) {
    console.error('Error reading .ics file:', error)
    return ''
  }
}

module.exports = { readICSFile }

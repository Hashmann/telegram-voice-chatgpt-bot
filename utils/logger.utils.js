import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config({ path: `.env${process.env.NODE_ENV}` })

export class Logger {
  constructor(options) {
    this.message = options.message
    this.err = options.err
    this.ip = options.ip
    this.status = options.status
    this.badge = options.badge
    this.file = options.file
  }

  static info(message, file, ip, status, badge) {
    const infoBadge = `[ ◀◀◀ INFO ▶▶▶ ]`
    let arrows = `➤➤➤ `
    let badgeLog = ''
    ip = ip !== '' ? `[${ip}] ` : ''
    if (badge === 'v') {
      badge = `[ ✔ ]`
      badgeLog = `\x1b[32m[ ✔ ]`
    } else if (badge === 'x') {
      badge = `[ ✘ ]`
      badgeLog = `\x1b[31m[ ✘ ]`
    } else badge = badgeLog = ''
    if (status === '') {
      arrows = status = ''
    } else status = `${status} `
    if (file !== '') file = `[${file}] `

    const logMessage = this.timestamp('log')
        + `\x1b[34m${infoBadge}`
        + `\x1b[35m ${message} `
        + `\x1b[34m${file}`
        + `\x1b[34m${ip}`
        + `\x1b[35m${arrows}`
        + `\x1b[32m${status}`
        + `${badgeLog}`
        + '\x1b[0m'
    const saveMessage = this.timestamp('save')
        + `${infoBadge}`
        + ` ${message} `
        + `${file}`
        + `${ip}`
        + `${arrows}`
        + `${status}`
        + `${badge}`

    console.log(logMessage)
    if (process.env.LOG_MODE === 'one_file') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME}`, saveMessage)
    } else if (process.env.LOG_MODE === 'different_files') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME_INFO}`, saveMessage)
    } else if (process.env.LOG_MODE === 'together') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME}`, saveMessage)
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME_INFO}`, saveMessage)
    } else return console.error('Please use "one_file", "different_files" or "together"')
  }

  static warning(message, file, ip, status) {
    const warningBadge = `[ ◀◀◀ WARNING ▶▶▶ ]`
    let arrows = `➤➤➤ `
    ip = ip !== '' ? `[${ip}] ` : ''
    if (status === '') {
      arrows = status = ''
    } else status = `${status} `
    if (file !== '') file = `[${file}] `

    const warnMessage = this.timestamp('log')
      + `\x1b[33m${warningBadge}`
      + `\x1b[35m ${message} `
      + `\x1b[34m${file}`
      + `\x1b[34m${ip}`
      + `\x1b[35m${arrows}`
      + `\x1b[33m${status}`
      + '\x1b[0m'
    const saveMessage = this.timestamp('save')
      + `${warningBadge}`
      + ` ${message} `
      + `${file}`
      + `${ip}`
      + `${arrows}`
      + `${status}`

    console.log(warnMessage)
    if (process.env.LOG_MODE === 'one_file') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME}`, saveMessage)
    } else if (process.env.LOG_MODE === 'different_files') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME_WARNING}`, saveMessage)
    } else if (process.env.LOG_MODE === 'together') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME}`, saveMessage)
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME_WARNING}`, saveMessage)
    } else return console.error('Please use "one_file", "different_files" or "together"')
  }

  static error(message, file, ip, err, status) {
    const errorBadge = `[ ◀◀◀ ERROR ▶▶▶ ]`
    const badge = `[ ✘ ]`
    const badgeLog = `\x1b[31m[ ✘ ]`
    let arrows = `➤➤➤ `
    let arrows2 = `➤➤➤ `
    ip = ip !== '' ? `[${ip}] ` : ''
    if (status === '') {
      arrows2 = status = ''
    } else status = `${status} `
    if (err === '') {arrows = ''} else {err = `${err} `}
    if (file !== '') file = `[${file}] `

    const errorMessage = this.timestamp('log')
      + `\x1b[31m${errorBadge}`
      + `\x1b[35m ${message} `
      + `\x1b[34m${file}`
      + `\x1b[34m${ip}`
      + `\x1b[35m${arrows}`
      + `\x1b[31m${err}`
      + `\x1b[35m${arrows2}`
      + `\x1b[31m${status}`
      + `${badgeLog}`
      + '\x1b[0m'
    const saveMessage = this.timestamp('save')
      + `${errorBadge}`
      + ` ${message} `
      + `${file}`
      + `${ip}`
      + `${arrows}`
      + `${err}`
      + `${arrows2}`
      + `${status}`
      + `${badge}`

    console.log(errorMessage)
    if (process.env.LOG_MODE === 'one_file') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME}`, saveMessage)
    } else if (process.env.LOG_MODE === 'different_files') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME_ERROR}`, saveMessage)
    } else if (process.env.LOG_MODE === 'together') {
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME}`, saveMessage)
      this.saveLog(`${process.env.LOG_PATH}/${process.env.LOG_FILENAME_ERROR}`, saveMessage)
    } else return console.error('Please use "one_file", "different_files" or "together"')
  }

  static saveLog(filePath, message) {
    fs.appendFile(filePath, message + '\n', (err) => {
      if (err) throw err
    })
  }
  static timestamp(settings) {
    let timestamp = new Date()
    if (settings === 'log') {
      timestamp = `\x1b[36m[${timestamp.toLocaleDateString()}]\x1b[36m[${timestamp.toLocaleTimeString()}] \x1b[35m✻ `
      return timestamp
    } else if (settings === 'save') {
      timestamp = `[${timestamp.toLocaleDateString()}][${timestamp.toLocaleTimeString()}] ✻ `
      return timestamp
    } else return console.error('Please use as an argument "log" or "save"')
  }
}
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Logger } from '../utils/logger.utils.js'
import fsPromises from 'fs/promises'
import * as dotenv from 'dotenv'

dotenv.config({ path: `.env${process.env.NODE_ENV}` })
const __dirname = dirname(fileURLToPath(import.meta.url))

class Config{
	checkingSettings() {
		try {
			let yandex = false
			if (process.env.VOICE_RESPONSE === 'true' && process.env.SPEECH_TO_TEXT_MODE === 'yandex' || process.env.TEXT_TO_SPEECH_MODE === 'yandex') yandex = true
			const requiredFields = ['TELEGRAM_BOT_TOKEN', 'OPENAI_API_KEY', yandex === true ? 'YANDEX_API_KEY' : '']
			const settingFields = [
				'VOICE_RESPONSE', 'SPEECH_TO_TEXT_MODE', 'TEXT_TO_SPEECH_MODE', 'SAVE_CHAT_HISTORY', 'SAVE_VOICE_HISTORY',
				'VOICE_SPEED_NORMAL', 'VOICE_SPEED_SLOW', 'VOICE_SPEED_FAST'
			]
			requiredFields.forEach((key, value) => {
				let response = this.get(key)
				if ( response.length <= 0 ) throw new Error(`Required fields[ '${key}' ] are not filled in`)
			})
			Logger.info('Token and API keys: not empty', 'config.service', '', 'CHECKED', 'v')
			settingFields.forEach((key, value) => {
				if (key === 'VOICE_RESPONSE') {
					const voiceResponse = this.get(key)
					if ( voiceResponse !== 'true' && voiceResponse !== 'false' ) throw new Error(`'VOICE_RESPONSE': 'true' or 'false'`)
				}
				if (key === 'SPEECH_TO_TEXT_MODE') {
					const sttMode = this.get(key)
					if ( sttMode !== 'openai' && sttMode !== 'yandex' ) throw new Error(`'SPEECH_TO_TEXT_MODE': 'openai' or 'yandex'`)
				}
				if (key === 'TEXT_TO_SPEECH_MODE') {
					const ttsMode = this.get(key)
					if ( ttsMode !== 'google' && ttsMode !== 'yandex' && ttsMode !== 'any' ) throw new Error(`'TEXT_TO_SPEECH_MODE': 'google', 'yandex' or 'any'`)
				}
				if (key === 'SAVE_CHAT_HISTORY') {
					const saveMode = this.get(key)
					if ( saveMode !== 'true' && saveMode !== 'false' ) throw new Error(`'SAVE_CHAT_HISTORY': 'true' or 'false'`)
				}
				if (key === 'SAVE_VOICE_HISTORY') {
					const saveVoiceMode = this.get(key)
					if ( saveVoiceMode !== 'request' && saveVoiceMode !== 'response' && saveVoiceMode !== 'any' && saveVoiceMode !== 'false' )
						throw new Error(`'SAVE_VOICE_HISTORY': 'request', 'response', 'any' or 'false'`)
				}
				if (key === 'VOICE_SPEED_NORMAL') {
					const voiceSpeedNormal = this.get('VOICE_SPEED_NORMAL')
					if ( 2 < +voiceSpeedNormal || +voiceSpeedNormal < 1 ) throw new Error(`'VOICE_SPEED_NORMAL': the value "1.0" - "2.0". Example: '1.5'`)
				}
				if (key === 'VOICE_SPEED_SLOW') {
					const voiceSpeedSlow = this.get('VOICE_SPEED_SLOW')
					if ( 2 < +voiceSpeedSlow || +voiceSpeedSlow < 1 ) throw new Error(`'VOICE_SPEED_SLOW': the value "1.0" - "2.0". Example: '1.3'`)
				}
				if (key === 'VOICE_SPEED_FAST') {
					const voiceSpeedFast = this.get('VOICE_SPEED_FAST')
					if ( 2 < +voiceSpeedFast || +voiceSpeedFast < 1 ) throw new Error(`'VOICE_SPEED_FAST': the value "1.0" - "2.0". Example: '1.8'`)
				}
				if ( !(this.get(key)) ) throw new Error(`Settings fields[ '${key}' ] are not filled in`)
			})
			Logger.info(`Settings: values are valid`, 'config.service', '', 'CHECKED', 'v')
			return true
		} catch (err) {
			Logger.error('Config checking settings:', 'config.service', '', err.message, 'ERROR')
		}
	}

	async checkingWhitelist() {
		try {
			const whitelist = await fsPromises.readFile(resolve(__dirname, '../config', 'whitelist.config.json'), 'utf8')
				.then(data => JSON.parse(data))
				.catch(err => Logger.error('Getting my statistics', 'utils', '', err.message, 'ERROR') )
			if (whitelist.users.length <= 0) throw new Error('Whitelist cannot be empty')
			Logger.info('Checking whitelist', 'config.service', '', 'CHECKED', 'v')
			return true
		} catch (err) {
			Logger.error('Checking whitelist', 'config.service', '' , err.message, 'ERROR')
		}
	}

	checkingLoggerSettings() {
		try {
			const loggerFields = ['LOG_MODE', 'LOG_PATH', 'LOG_FILENAME', 'LOG_FILENAME_INFO', 'LOG_FILENAME_WARNING', 'LOG_FILENAME_ERROR']
			loggerFields.forEach(key => {
				if (key === 'LOG_MODE') {
					const logMode = this.get('LOG_MODE')
					if ( logMode !== 'one_file' && logMode !== 'different_files' && logMode !== 'together' ) throw new Error(`'LOG_MODE': 'one_file', 'different_files' or 'together'`)
				}
				if (key === 'LOG_PATH') {
					const logPath = this.get('LOG_PATH')
					if ( logPath.length <=0 ) throw new Error(`'LOG_PATH': the value cannot be empty. Example: './log'`)
				}
				if (key === 'LOG_FILENAME') {
					const logFilename = this.get('LOG_FILENAME')
					if ( logFilename.length <=0 ) throw new Error(`'LOG_FILENAME': the value cannot be empty. Example: 'common.log.txt'`)
				}
				if (key === 'LOG_FILENAME_INFO') {
					const logFilenameInfo = this.get('LOG_FILENAME_INFO')
					if ( logFilenameInfo.length <=0 ) throw new Error(`'LOG_FILENAME_INFO': the value cannot be empty. Example: 'info.log.txt'`)
				}
				if (key === 'LOG_FILENAME_WARNING') {
					const logFilenameWarn = this.get('LOG_FILENAME_WARNING')
					if ( logFilenameWarn.length <=0 ) throw new Error(`'LOG_FILENAME_WARNING': the value cannot be empty. Example: 'warnings.log.txt'`)
				}
				if (key === 'LOG_FILENAME_ERROR') {
					const logFilenameErr = this.get('LOG_FILENAME_ERROR')
					if ( logFilenameErr.length <=0 ) throw new Error(`'LOG_FILENAME_ERROR': the value cannot be empty. Example: 'errors.log.txt'`)
				}
			})
			Logger.info(`Logger: values are valid`, 'config.service', '', 'CHECKED', 'v')
			return true
		} catch (err) {
			Logger.error('Checking logger config', 'config.service', '' , err.message, 'ERROR')
		}
	}

	getLaunchMode() {
		let mode = process.env.NODE_ENV
		if (mode === '') mode = 'dev'
		if (mode === '.development') mode = 'development'
		if (mode === '.production') mode = 'production'
		return mode
	}

	get(key) {
		try {
			let values = [
				'TELEGRAM_BOT_TOKEN', 'OPENAI_API_KEY', 'YANDEX_API_KEY',
				'VOICE_RESPONSE', 'SPEECH_TO_TEXT_MODE', 'TEXT_TO_SPEECH_MODE', 'SAVE_CHAT_HISTORY', 'SAVE_VOICE_HISTORY',
				'LOG_MODE', 'LOG_PATH', 'LOG_FILENAME', 'LOG_FILENAME_INFO', 'LOG_FILENAME_WARNING', 'LOG_FILENAME_ERROR',
				'VOICE_SPEED_NORMAL', 'VOICE_SPEED_SLOW', 'VOICE_SPEED_FAST'
			]
			const resultValue = {
				'TELEGRAM_BOT_TOKEN' : process.env.TELEGRAM_BOT_TOKEN,
				'OPENAI_API_KEY' : process.env.OPENAI_API_KEY,
				'YANDEX_API_KEY' : process.env.YANDEX_API_KEY,
				'VOICE_RESPONSE' : process.env.VOICE_RESPONSE,
				'SPEECH_TO_TEXT_MODE' : process.env.SPEECH_TO_TEXT_MODE,
				'TEXT_TO_SPEECH_MODE' : process.env.TEXT_TO_SPEECH_MODE,
				'SAVE_CHAT_HISTORY' : process.env.SAVE_CHAT_HISTORY,
				'SAVE_VOICE_HISTORY': process.env.SAVE_VOICE_HISTORY,
				'LOG_MODE': process.env.LOG_MODE,
				'LOG_PATH': process.env.LOG_PATH,
				'LOG_FILENAME': process.env.LOG_FILENAME,
				'LOG_FILENAME_INFO': process.env.LOG_FILENAME_INFO,
				'LOG_FILENAME_WARNING': process.env.LOG_FILENAME_WARNING,
				'LOG_FILENAME_ERROR': process.env.LOG_FILENAME_ERROR,
				'VOICE_SPEED_NORMAL': process.env.VOICE_SPEED_NORMAL,
				'VOICE_SPEED_SLOW': process.env.VOICE_SPEED_SLOW,
				'VOICE_SPEED_FAST': process.env.VOICE_SPEED_FAST,
			}
			let isFieldError = true
			let result = ''
			values.forEach((keySetting, value) => {
				if (keySetting === key) {
					isFieldError = false
					result = resultValue[key].toString()
				}
			})
			if ( isFieldError === true ) throw new Error(`Getting fields[ '${key}' ${isFieldError} ] invalid`)
			return result
		} catch (err) {
			Logger.error('Getting config:', 'config.service', '', err.message, 'ERROR')
		}
	}
}

export const config = new Config()
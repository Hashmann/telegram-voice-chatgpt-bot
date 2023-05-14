import { session, Telegraf } from 'telegraf'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { config } from '../config/config.service.js'
import { commands } from './commands/commands.js'
import { handlers } from './handlers/bot.handlers.js'
import { utils } from '../utils/utils.js'
import { Logger } from '../utils/logger.utils.js'
import fsPromises from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

class Bot {
	settings = {
		responseMode: 'any',              // 'text', 'voice', 'any'
		responseVoiceLanguage: 'ru',      // 'ru', 'en', 'de', 'kk', 'uz'
		responseLocale: 'ru-RU',
		responseVoiceGender: 'female',    // 'male', 'female'
		responseVoice: 'omazh',
		responseVoiceEmotion: 'neutral',  // neutral, good, evil,
		responseVoiceSpeed: 'normal',     // fast, slow, normal
		responseVoiceApi: 'any',       //  'google', 'yandex' or 'any'
	}
	constructor(token) {
		this.bot = new Telegraf(token)
		this.bot.use(session())
		this.menuState = new Map()
		this.userSettings = new Map(Object.entries(this.settings))
	}
	// Session init
	SESSION = {
		messages: []
	}
	// Getting users whitelist
	whitelist = fsPromises.readFile(resolve(__dirname, '../config', 'whitelist.config.json'), 'utf8')
		.then(data => { this.whitelist = JSON.parse(data) })
		.catch(err => { console.log('Read whitelist.config.json ERROR:' + err) })

	// Start bot
	launch() {
		commands.botCommands(telegramBot)
		commands.start(telegramBot)
		commands.restart(telegramBot)
		commands.settings(telegramBot, this.menuState, this.userSettings)
		commands.stats(telegramBot)
		commands.test(telegramBot)
		commands.test2(telegramBot)
		handlers.voice(telegramBot)
		handlers.text(telegramBot)
		this.bot.launch()
		Logger.info('Bot status:', `mode: ${config.getLaunchMode()}`, ``, 'STARTED', 'v')
	}

	async setUserSettings(userId) {
		try {
			const userSettings = await utils.getSettings(userId)
			console.log(userSettings)
			const settings = userSettings.settings
			for (let settingsKey in settings) {
				if (settings[settingsKey] !== this.userSettings.get(settingsKey)) this.userSettings.set(settingsKey, settings[settingsKey])
			}
			Logger.info('User Configuration Setting', 'bot', '', 'DONE', 'v')
		} catch (err) {
			Logger.error('User Configuration Setting', 'bot', '', err.message, 'ERROR')
		}
	}
}

export const telegramBot = new Bot(BOT_TOKEN)
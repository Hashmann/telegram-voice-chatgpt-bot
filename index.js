import { config } from './config/config.service.js'
import { telegramBot } from './bot/bot.js'

// Launching telegram bot
if (config.checkingSettings() && config.checkingLoggerSettings() && await config.checkingWhitelist())
	telegramBot.launch()

process.once('SIGINT', () => telegramBot.bot.stop('SIGINT'))
process.once('SIGTERM', () => telegramBot.bot.stop('SIGTERM'))
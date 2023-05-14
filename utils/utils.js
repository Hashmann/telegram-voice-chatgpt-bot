import { telegramBot } from '../bot/bot.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Logger } from './logger.utils.js'
import fsPromises from 'fs/promises'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

class Utils {
	// Deleting file
	async deleteFile(path) {
		try {
			await fsPromises.unlink(path)
		} catch (err) {
			Logger.error('Deleting file', 'utils', '', err.message, 'ERROR')
		}
	}
	// Deleting directory
	async deleteDir(path) {
		try {
			if (!fs.readdirSync(path)) await fs.rmdirSync(path)
		} catch (err) {
			Logger.error('Deleting directory', 'utils', '', err.message, 'ERROR')
		}
	}

	// Writing statistics
	pushStatistics(from, request, response, type) {
		fsPromises.readFile(resolve(__dirname, '../data', 'statistics.data.json'), 'utf8')
			.then(data => {
				let statistics = JSON.parse(data)
				const user = statistics.find(user => user.id === from.id)
				if (!user) {
					const numberOfWord = request.split(' ').length
					const numberOfRequest = 1
					let voiceRequests = 0
					let textRequests = 0
					let valueCharacterOfResponse = 0
					if (type === 'voice') voiceRequests = voiceRequests + 1
					if (type === 'text') textRequests = textRequests + 1
					if (response.length !== 0) valueCharacterOfResponse = response.length
					const statisticsData = {
						id: from.id,
						username: from.username,
						numberOfRequest,
						voiceRequests,
						textRequests,
						numberOfWord,
						valueCharacterOfResponse
					}
					statistics.push(statisticsData)
					fsPromises.writeFile(resolve(__dirname, '../data', 'statistics.data.json'), JSON.stringify(statistics))
						.then(() => { Logger.info('Creating a new record', 'utils', '', 'DONE', 'v') })
						.catch(err => { Logger.error('Creating a new record', 'utils', '', err.message, 'FAILED') })
				} else {
					user.numberOfWord = user.numberOfWord + request.split(' ').length
					user.numberOfRequest = user.numberOfRequest + 1
					if (type === 'voice') user.voiceRequests = user.voiceRequests + 1
					if (type === 'text') user.textRequests = user.textRequests + 1
					if (response.length !== 0) user.valueCharacterOfResponse = user.valueCharacterOfResponse + response.length
					fsPromises.writeFile(resolve(__dirname, '../data', 'statistics.data.json'), JSON.stringify(statistics))
						.then(() => { Logger.info('Update statistics.data.json', 'utils', '', 'DONE', 'v') })
						.catch(err => { Logger.error('Update statistics.data.json', 'utils', '', err.message, 'FAILED') })
				}
			})
			.catch(err => { Logger.error('Read statistics.data.json', 'utils', '', err.message, 'ERROR') })
	}

	// Getting statistics
	async getStatistics(userId) {
		return await fsPromises.readFile(resolve(__dirname, '../data', 'statistics.data.json'), 'utf8')
			.then(data => {
				let statistics = JSON.parse(data)
				return statistics.find(user => user.id === userId)
			})
			.catch(err => {
				Logger.error('Getting my statistics', 'utils', '', err.message, 'ERROR')
			})
	}

	async pushHistory(from, userData, assistantData) {
		try {
			const data = JSON.parse(await fsPromises.readFile(resolve(__dirname, '../data', 'history.data.json'), 'utf8'))
			const userHistory = data.find(user => user.id === from.id)
			if (!userHistory) {
				const historyData = {
					id: from.id,
					username: from.username,
					history: [
						{
							userMessage: userData.message,
							userMessagePath: userData.path,
							assistantMessage: assistantData.message,
							assistantMessagePath: assistantData.path
						}
					]
				}
				data.push(historyData)
				await fsPromises.writeFile(resolve(__dirname, '../data', 'history.data.json'), JSON.stringify(data))
			} else {
				userHistory.history.push({
					userMessage: userData.message,
					userMessagePath: userData.path,
					assistantMessage: assistantData.message,
					assistantMessagePath: assistantData.path
				})
				await fsPromises.writeFile(resolve(__dirname, '../data', 'history.data.json'), JSON.stringify(data))
			}
		} catch (err) {
			Logger.error('Push history', 'utils', '', err.message, 'ERROR')
		}
	}

	getHistory(userId) {

	}

	async saveSettings(userId, from, settings) {
		fsPromises.readFile(resolve(__dirname, '../data', 'settings.data.json'), 'utf8')
			.then(data => {
				let settingsFile = JSON.parse(data)
				const userSettings = settingsFile.find(user => user.id === +userId)
				if (!userSettings) {
					const settingsData = {
						id: userId,
						username: from.username,
						settings: telegramBot.settings,
					}
					settingsFile.push(settingsData)
					fsPromises.writeFile(resolve(__dirname, '../data', 'settings.data.json'), JSON.stringify(settingsFile))
						.then(() => { Logger.info('Creating a new settings for user', 'utils', '', 'DONE', 'v') })
						.catch(err => { Logger.error('Creating a new settings for user', 'utils', '', err.message, 'FAILED') })
				} else {
					for (let key in telegramBot.settings) {
						if (settings.get(key) !== userSettings.settings[key]) userSettings.settings[key] = settings.get(key)
					}
					fsPromises.writeFile(resolve(__dirname, '../data', 'settings.data.json'), JSON.stringify(settingsFile))
						.then(() => { Logger.info('Updating settings.data.json', 'utils', '', 'DONE', 'v') })
						.catch(err => { Logger.error('Updating settings.data.json', 'utils', '', err.message, 'FAILED') })
				}
			})
			.catch(err => { Logger.error('Reading settings.data.json', 'utils', '', err.message, 'ERROR') })
	}

	async getSettings(userId) {
		try {
			const settings = await fsPromises.readFile(resolve(__dirname, '../data', 'settings.data.json'), 'utf8')
				.then(data => {
					let settings = JSON.parse(data)
					return settings.find(user => user.id === +userId)
				})
				.catch(err => Logger.error('Reading settings.data.json', 'utils', '', err.message, 'ERROR'))
			Logger.info('Getting settings for user', 'utils', `id: ${userId}`, 'DONE', 'v')
			return settings
		} catch (err) {
			Logger.error('Getting settings for user', 'utils', `id: ${userId}`, err.message, 'ERROR')
		}
	}
}

export const utils = new Utils()
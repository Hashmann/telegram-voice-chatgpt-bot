import { googleTranslator } from '../../api/googleTranslate.api.js'
import { utils } from '../../utils/utils.js'
import { code } from 'telegraf/format'
import { settingsHandler } from '../handlers/settings.handler.js'
import {telegramBot} from "../bot.js";
import {yandexSpeech} from "../../api/yandexSpeech.api.js";
import fs from "fs";
import {buttonsHandler} from "../handlers/buttons.handler.js";
import {checkbox} from "../handlers/checkbox.handler.js";

class Commands {
	botCommands(telegramBot) {
		telegramBot.bot.telegram.setMyCommands([
			// {command: 'start', description: 'Запустить ChatGPT'},
			{command: 'restart', description: 'Перезапустить ChatGPT и сбросить контекст'},
			{command: 'settings', description: 'Настройки'},
			{command: 'stats', description: 'Моя статистика'},
			{command: 'test', description: 'test command'},
			{command: 'test2', description: 'test2 command'},
		])
	}

	start(telegramBot) {
		telegramBot.bot.command('start',async ctx => {
			ctx.session = telegramBot.SESSION
			await ctx.reply(`Приветствую, ${ctx.message.from.first_name}! Для общения с ChatGPT можно использовать голосовые или текстовые сообщения.`, {reply_markup: { remove_keyboard: true }})
			await utils.saveSettings(ctx.message.from.id, ctx.message.from, telegramBot.settings)
			// await telegramBot.setUserSettings(ctx.message.from.id)
			// await telegramBot.setUserSettings(ctx.message.from.id)
		})
	}

	restart(telegramBot) {
		telegramBot.bot.command('restart',async ctx => {
			ctx.session = telegramBot.SESSION
			await ctx.reply('Контекст очищен. Отправте мне новый голосовой или текстовый запрос', {reply_markup: { remove_keyboard: true }})
			const getUserSettings = utils.getSettings(ctx.message.from.id)
			await telegramBot.setUserSettings(ctx.message.from.id)

			// await ctx.reply( code('Бот перезагружается...') )
			// await telegramBot.restartBot()
			// await ctx.reply( code('Бот перезагружен.') )

			// this.start(telegramBot)
			// const text = 'Hi, my name is Vyacheslav! I love programming!'
			// // const text = 'Приветик'
			// const translation = await googleTranslator.translate(text, {to: 'ru'})
			// console.log(translation)
			// const response = await googleTranslator.textToSpeech(ctx.message.from.id, translation)
			// await ctx.replyWithAudio({source: response})
			// await ctx.reply(translation)
		})
	}

	stats(telegramBot) {
		telegramBot.bot.command('stats',async ctx => {
			const stats = await utils.getStatistics(ctx.message.from.id)
			// await ctx.reply(JSON.stringify(stats, null, 2))
			await ctx.reply(code(`Количество запросов всего: ${stats.numberOfRequest}`))
			await ctx.reply(code(`Количество голосовых запросов: ${stats.voiceRequests}`))
			await ctx.reply(code(`Количество текстовых запросов: ${stats.textRequests}`))
			await ctx.reply(code(`Количество слов во всех запросах: ${stats.numberOfWord}`))
			await ctx.reply(code(`Количество символов в голосовых ответах: ${stats.valueCharacterOfResponse}`))

			const settings = await utils.getSettings(ctx.message.from.id)
			await ctx.reply(JSON.stringify(settings, null, 2))
		})
	}

	settings(telegramBot, menuState, settings) {
		// Menu
		telegramBot.bot.command('settings', async ctx => {
			await telegramBot.setUserSettings(ctx.message.from.id)
			settingsHandler.mainMenu(ctx, menuState)
		})
		telegramBot.bot.action('Настройки ответа', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Режим ответа', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Голосовой синтезатор', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Настройки синтезатора', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Язык', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Пол', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Персонаж', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Амплуа', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		telegramBot.bot.action('Скорость', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		// Navigation
		telegramBot.bot.action('Меню настроек', ctx => settingsHandler.backToMainMenu(ctx, menuState))
		telegramBot.bot.action('Назад', ctx => buttonsHandler.handleButton(ctx, menuState, settings))
		// Checkboxes
		telegramBot.bot.on('callback_query', (ctx) => checkbox.checkboxes(ctx, settings))
	}

	test(telegramBot) {
		telegramBot.bot.command('test',async ctx => {
			try {
				// const text = 'Hi, my name is Vyacheslav!'
				// await ctx.reply(text)
				// const settings = {
				// 	responseMode: 'any',              // 'text', 'voice', 'any'
				// 	responseVoiceLanguage: 'ru',      // 'ru', 'en', 'de', 'kk', 'uz'
				// 	responseVoiceGender: 'male',    // 'male', 'female'
				// 	responseVoice: 'zahar',
				// 	responseVoiceEmotion: 'good',
				// 	responseVoiceSpeed: 'normal',     // fast, slow, normal
				// 	responseVoiceApi: 'yandex',       //  'google' or 'yandex'
				// }
				// await utils.saveSettings(ctx.message.from, settings)
				console.log(telegramBot.userSettings)
			} catch (err) {
				console.log('COMMAND TEST ERROR:', err)
			}
		})
	}

	test2(telegramBot) {
		telegramBot.bot.command('test2',async ctx => {
			try {
				await yandexSpeech.setUserConfig(ctx.message.from.id)
				// console.log(telegramBot.SESSION)
				// const data = await utils.pushHistory(ctx.message.from) // ctx.message.from.id
				// console.log(data)

				// const text = 'Hi, my name is Vyacheslav!'
				// const text = 'Сәлем, Менің атым Вячеслав!'
				// await ctx.reply(text)
				// await yandexSpeech.textToSpeech(ctx.message.from.id, telegramBot.userSettings,text)
			} catch (err) {
				console.log('COMMAND TEST2 ERROR:', err)
			}
		})
	}
}

export const commands = new Commands()
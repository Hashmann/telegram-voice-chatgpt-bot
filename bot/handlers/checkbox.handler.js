import { telegramBot } from '../bot.js'
import { settingsKeyboard } from '../keyboards/settings.keyboard.js'
import { yandexSpeech } from '../../api/yandexSpeech.api.js'
import { utils } from '../../utils/utils.js'


class Checkbox {
	test(ctx, settings) {
		const keyboard = settingsKeyboard.mainMenu()
		// console.log(keyboard.reply_markup.inline_keyboard[1][0].text)
		// console.log(keyboard.reply_markup.inline_keyboard)
		// console.log('id', ctx.update.callback_query.message.reply_markup.inline_keyboard[1][0].text)
		console.log(ctx.update.callback_query.data)
		if (ctx.update.callback_query.data === 'Настройки ChatGPT') {
			if (ctx.update.callback_query.message.reply_markup.inline_keyboard[1][0].text === 'Настройки ChatGPT') {
				keyboard.reply_markup.inline_keyboard[1][0].text = '✓ Настройки ChatGPT' // ✔️ ✔ ✅ ✓
				const newKeyboard = JSON.stringify({
					inline_keyboard: keyboard.reply_markup.inline_keyboard
				})
				ctx.editMessageReplyMarkup(newKeyboard)
				ctx.answerCbQuery('Установлено значение 1')
			}

			if (ctx.update.callback_query.message.reply_markup.inline_keyboard[1][0].text === '✓ Настройки ChatGPT') {
				keyboard.reply_markup.inline_keyboard[1][0].text = 'Настройки ChatGPT'
				const newKeyboard = JSON.stringify({
					inline_keyboard: keyboard.reply_markup.inline_keyboard
				})
				ctx.editMessageReplyMarkup(newKeyboard)
				ctx.answerCbQuery('Установлено значение 2')
			}
		}
	}

	async responseSettingsModeCheckbox(ctx, settings) {
		if (ctx.update.callback_query.data === 'Текстом' && settings.get('responseMode') !== 'text') {
			settings.set('responseMode', 'text')
			const keyboard = settingsKeyboard.responseSettingsMode()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Получать ответ: Текстом')
		}
		if (ctx.update.callback_query.data === 'Голосом' && settings.get('responseMode') !== 'voice') {
			settings.set('responseMode', 'voice')
			const keyboard = settingsKeyboard.responseSettingsMode()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Получать ответ: Голосом')
		}
		if (ctx.update.callback_query.data === 'Текстом и голосом' && settings.get('responseMode') !== 'any') {
			settings.set('responseMode', 'any')
			const keyboard = settingsKeyboard.responseSettingsMode()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Получать ответ: Текстом и голосом')
		}
		await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
	}

	async responseSettingsApiCheckbox(ctx, settings) {
		if (ctx.update.callback_query.data === 'Yandex' && settings.get('responseVoiceApi') !== 'yandex') {
			settings.set('responseVoiceApi', 'yandex')
			const keyboard = settingsKeyboard.responseSettingsApi()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Голосовой синтезатор: Yandex')
		}
		if (ctx.update.callback_query.data === 'Google' && settings.get('responseVoiceApi') !== 'google') {
			settings.set('responseVoiceApi', 'google')
			const keyboard = settingsKeyboard.responseSettingsApi()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Голосовой синтезатор: Google')
		}
		if (ctx.update.callback_query.data === 'Все синты' && settings.get('responseVoiceApi') !== 'any') {
			settings.set('responseVoiceApi', 'any')
			const keyboard = settingsKeyboard.responseSettingsApi()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Голосовой синтезатор: Все')
		}
		await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
	}

	async voiceSettingsLanguageCheckbox(ctx, settings) {
		if (ctx.update.callback_query.data === 'ru' && settings.get('responseVoiceLanguage') !== 'ru') {
			settings.set('responseVoiceLanguage', 'ru')
			settings.set('responseLocale', 'ru-RU')
			yandexSpeech.resetDefaultLanguageVoiceSettings('ru')
			const keyboard = settingsKeyboard.voiceSettingsLanguage()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Язык: Русский')
		}
		if (ctx.update.callback_query.data === 'en' && settings.get('responseVoiceLanguage') !== 'en') {
			settings.set('responseVoiceLanguage', 'en')
			settings.set('responseLocale', 'en-US')
			yandexSpeech.resetDefaultLanguageVoiceSettings('en')
			const keyboard = settingsKeyboard.voiceSettingsLanguage()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Язык: English')
		}
		if (ctx.update.callback_query.data === 'de' && settings.get('responseVoiceLanguage') !== 'de') {
			settings.set('responseVoiceLanguage', 'de')
			settings.set('responseLocale', 'de-DE')
			yandexSpeech.resetDefaultLanguageVoiceSettings('de')
			const keyboard = settingsKeyboard.voiceSettingsLanguage()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Язык: Deutsch')
		}
		if (ctx.update.callback_query.data === 'kk' && settings.get('responseVoiceLanguage') !== 'kk') {
			settings.set('responseVoiceLanguage', 'kk')
			settings.set('responseLocale', 'kk-KK')
			yandexSpeech.resetDefaultLanguageVoiceSettings('kk')
			const keyboard = settingsKeyboard.voiceSettingsLanguage()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Язык: Қазақша')
		}
		if (ctx.update.callback_query.data === 'uz' && settings.get('responseVoiceLanguage') !== 'uz') {
			settings.set('responseVoiceLanguage', 'uz')
			settings.set('responseLocale', 'uz-UZ')
			yandexSpeech.resetDefaultLanguageVoiceSettings('uz')
			const keyboard = settingsKeyboard.voiceSettingsLanguage()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery('Язык: Ўзбек')
		}
		await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
	}

	async voiceSettingsLanguageGenderCheckbox(ctx, settings) {
		// console.log(ctx.update.callback_query.data)
		if (ctx.update.callback_query.data === 'male' && settings.get('responseVoiceGender') !== 'male') {
			settings.set('responseVoiceGender', 'male')
			const keyboard = settingsKeyboard.voiceSettingsLanguageGender()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			yandexSpeech.resetDefaultGenderSettings('male')
			ctx.answerCbQuery('Пол: Мужской')
		}
		if (ctx.update.callback_query.data === 'female' && settings.get('responseVoiceGender') !== 'female') {
			settings.set('responseVoiceGender', 'female')
			const keyboard = settingsKeyboard.voiceSettingsLanguageGender()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			yandexSpeech.resetDefaultGenderSettings('female')
			ctx.answerCbQuery('Пол: Женский')
		}
		await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
	}

	async voiceSettingsVoicesCheckbox(ctx, settings) {
		const language = settings.get('responseVoiceLanguage')
		const gender = settings.get('responseVoiceGender')
		// console.log(ctx.update.callback_query.data)
		switch (language) {
			// Russian
			case 'ru':
				// Male
				if (gender === 'male') {
					if (ctx.update.callback_query.data === 'filipp' && settings.get('responseVoice') !== 'filipp') {
						settings.set('responseVoice', 'filipp')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						ctx.answerCbQuery('Персонаж: Филипп')

					}
					if (ctx.update.callback_query.data === 'ermil' && settings.get('responseVoice') !== 'ermil') {
						settings.set('responseVoice', 'ermil')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('ermil')
						ctx.answerCbQuery('Персонаж: Эрмил')
					}
					if (ctx.update.callback_query.data === 'madirus' && settings.get('responseVoice') !== 'madirus') {
						settings.set('responseVoice', 'madirus')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('madirus')
						ctx.answerCbQuery('Персонаж: Мадирус')
					}
					if (ctx.update.callback_query.data === 'zahar' && settings.get('responseVoice') !== 'zahar') {
						settings.set('responseVoice', 'zahar')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('zahar')
						ctx.answerCbQuery('Персонаж: Захар')
					}
				}
				// Female
				if (gender === 'female') {
					if (ctx.update.callback_query.data === 'alena' && settings.get('responseVoice') !== 'alena') {
						settings.set('responseVoice', 'alena')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						ctx.answerCbQuery('Персонаж: Алёна')
					}
					if (ctx.update.callback_query.data === 'jane' && settings.get('responseVoice') !== 'jane') {
						settings.set('responseVoice', 'jane')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('jane')
						ctx.answerCbQuery('Персонаж: Джейн')
					}
					if (ctx.update.callback_query.data === 'omazh' && settings.get('responseVoice') !== 'omazh') {
							settings.set('responseVoice', 'omazh')
							const keyboard = settingsKeyboard.voiceSettingsVoices()
							const newKeyboard = JSON.stringify({
								inline_keyboard: keyboard.reply_markup.inline_keyboard
							})
							ctx.editMessageReplyMarkup(newKeyboard)
							yandexSpeech.resetDefaultVoiceSettings('omazh')
							ctx.answerCbQuery('Персонаж: Омаж')

					}
				}
				await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
				break
			// English
			case 'en':
				if (gender === 'male') {
					if (ctx.update.callback_query.data === 'john' && settings.get('responseVoice') !== 'john') {
						settings.set('responseVoice', 'john')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('john')
						ctx.answerCbQuery('Персонаж: Джон')
					}
				}
				await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
				break
			// German
			case 'de':
				if (gender === 'female') {
					if (ctx.update.callback_query.data === 'lea' && settings.get('responseVoice') !== 'lea') {
						settings.set('responseVoice', 'lea')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('lea')
						ctx.answerCbQuery('Персонаж: Леа')
					}
				}
				await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
				break
			// Kazakh
			case 'kk':
				if (gender === 'male') {
					if (ctx.update.callback_query.data === 'madi' && settings.get('responseVoice') !== 'madi') {
						settings.set('responseVoice', 'madi')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('madi')
						ctx.answerCbQuery('Персонаж: Мади')
					}
				}
				if (gender === 'female') {
					if (ctx.update.callback_query.data === 'amira' && settings.get('responseVoice') !== 'amira') {
						settings.set('responseVoice', 'amira')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('amira')
						ctx.answerCbQuery('Персонаж: Амира')
					}
				}
				await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
				break
			// Uzbek
			case 'uz':
				if (gender === 'female') {
					if (ctx.update.callback_query.data === 'nigora' && settings.get('responseVoice') !== 'nigora') {
						settings.set('responseVoice', 'nigora')
						const keyboard = settingsKeyboard.voiceSettingsVoices()
						const newKeyboard = JSON.stringify({
							inline_keyboard: keyboard.reply_markup.inline_keyboard
						})
						ctx.editMessageReplyMarkup(newKeyboard)
						yandexSpeech.resetDefaultVoiceSettings('nigora')
						ctx.answerCbQuery('Персонаж: Нигора')
					}
				}
				await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
				break
		}
	}

	async voiceSettingsRolesCheckbox(ctx, settings) {
		if (ctx.update.callback_query.data === 'Радостный' && settings.get('responseVoiceEmotion') !== 'good') {
			settings.set('responseVoiceEmotion', 'good')
			const keyboard = settingsKeyboard.voiceSettingsRole(settings.get('responseVoice'))
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery(`Амплуа: ${settings.get('responseVoiceGender') === 'male' ? 'Радостный' : 'Радостная'}`)
		}
		if (ctx.update.callback_query.data === 'Нейтральный' && settings.get('responseVoiceEmotion') !== 'neutral') {
			settings.set('responseVoiceEmotion', 'neutral')
			const keyboard = settingsKeyboard.voiceSettingsRole(settings.get('responseVoice'))
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery(`Амплуа: ${settings.get('responseVoiceGender') === 'male' ? 'Нейтральный' : 'Нейтральная'}`)
		}
		if (ctx.update.callback_query.data === 'Раздраженный' && settings.get('responseVoiceEmotion') !== 'evil') {
			settings.set('responseVoiceEmotion', 'evil')
			const keyboard = settingsKeyboard.voiceSettingsRole(settings.get('responseVoice'))
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery(`Амплуа: ${settings.get('responseVoiceGender') === 'male' ? 'Раздраженный' : 'Раздраженная'}`)
		}
		await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
	}

	async voiceSettingsSpeedCheckbox(ctx, settings) {
		if (ctx.update.callback_query.data === 'Быстрая' && settings.get('responseVoiceSpeed') !== 'fast') {
			settings.set('responseVoiceSpeed', 'fast')
			const keyboard = settingsKeyboard.voiceSettingsSpeed()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery(`Скорость: Быстрая`)
		}
		if (ctx.update.callback_query.data === 'Нормальная' && settings.get('responseVoiceSpeed') !== 'normal') {
			settings.set('responseVoiceSpeed', 'normal')
			const keyboard = settingsKeyboard.voiceSettingsSpeed()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery(`Скорость: Нормальная`)
		}
		if (ctx.update.callback_query.data === 'Медленная' && settings.get('responseVoiceSpeed') !== 'slow') {
			settings.set('responseVoiceSpeed', 'slow')
			const keyboard = settingsKeyboard.voiceSettingsSpeed()
			const newKeyboard = JSON.stringify({
				inline_keyboard: keyboard.reply_markup.inline_keyboard
			})
			ctx.editMessageReplyMarkup(newKeyboard)
			ctx.answerCbQuery(`Скорость: Медленная`)
		}
		await utils.saveSettings(ctx.update.callback_query.message.chat.id, '', telegramBot.userSettings)
	}

	async checkboxes(ctx, settings) {
		const data = ctx.update.callback_query.data
		let group = ''
		if (data === 'Настройки ChatGPT') group = 'test'
		if (data === 'Текстом' || data === 'Голосом' || data === 'Текстом и голосом') group = 'responseSettingsModeCheckbox'
		if (data === 'Yandex' || data === 'Google' || data === 'Все синты') group = 'responseSettingsApiCheckbox'
		if (data === 'ru' || data === 'en' || data === 'de' || data === 'kk' || data === 'uz') group = 'voiceSettingsLanguageCheckbox'
		if (data === 'male' || data === 'female') group = 'voiceSettingsLanguageGenderCheckbox'
		for (const name in yandexSpeech.voiceConfig.allVoices) if (data === name) group = 'voiceSettingsVoices'
		if (data === 'Радостный' || data === 'Нейтральный' || data === 'Раздраженный') group = 'voiceSettingsRolesCheckbox'
		if (data === 'Быстрая' || data === 'Нормальная' || data === 'Медленная') group = 'voiceSettingsSpeedCheckbox'
		switch (group) {
			case 'test':
				this.test(ctx)
				break
			case 'responseSettingsModeCheckbox':
				await this.responseSettingsModeCheckbox(ctx, settings)
				break
			case 'responseSettingsApiCheckbox':
				await this.responseSettingsApiCheckbox(ctx, settings)
				break
			case 'voiceSettingsLanguageCheckbox':
				await this.voiceSettingsLanguageCheckbox(ctx, settings)
				break
			case 'voiceSettingsLanguageGenderCheckbox':
				await this.voiceSettingsLanguageGenderCheckbox(ctx, settings)
				break
			case 'voiceSettingsVoices':
				await this.voiceSettingsVoicesCheckbox(ctx, settings)
				break
			case 'voiceSettingsRolesCheckbox':
				await this.voiceSettingsRolesCheckbox(ctx, settings)
				break
			case 'voiceSettingsSpeedCheckbox':
				await this.voiceSettingsSpeedCheckbox(ctx, settings)
				break
		}
	}
}

export const checkbox = new Checkbox()
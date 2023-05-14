import { telegramBot } from '../bot.js'
import { settingsKeyboard } from '../keyboards/settings.keyboard.js'

class SettingsHandler {
	constructor() {
	}
	// Main menu
	mainMenu(ctx, menuState) {
		menuState.set(ctx.from.id, 'mainMenu')
		return ctx.reply('Вы находитесь в главном меню настроек. Пожалуйста, выберите, интересующие настройки:', settingsKeyboard.mainMenu())
	}
	backToMainMenu(ctx, menuState) {
		menuState.set(ctx.from.id, 'mainMenu')
		return ctx.editMessageText('Вы находитесь в главном меню настроек. Пожалуйста, выберите, интересующие настройки:', settingsKeyboard.mainMenu())
	}

	responseSettings(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'responseSettings')
		const keyboard = settingsKeyboard.responseSettings()
		return ctx.editMessageText('Настройки ответа от ChatGPT', keyboard)
	}

	responseSettingsMode(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'responseSettingsMode')
		const keyboard = settingsKeyboard.responseSettingsMode()
		return ctx.editMessageText('Выберете в каком виде вы хотите получать ответ от ChatGPT:', keyboard)
	}

	responseSettingsApi(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'responseSettingsApi')
		const keyboard = settingsKeyboard.responseSettingsApi()
		return ctx.editMessageText('Выберете голосовой синтезатор:', keyboard)
	}

	voiceSettingsYandex(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'voiceSettingsYandex')
		const keyboard = settingsKeyboard.voiceSettingsYandex()
		return ctx.editMessageText('Выберете настройки для синтезатора речи от Yandex:', keyboard)
	}

	voiceSettingsLanguage(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'voiceSettingsLanguage')
		const keyboard = settingsKeyboard.voiceSettingsLanguage()
		return ctx.editMessageText('Выберете язык для голосового ответа:', keyboard)
	}

	voiceSettingsLanguageGender(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'voiceSettingsLanguageGender')
		const keyboard = settingsKeyboard.voiceSettingsLanguageGender()
		return ctx.editMessageText('Выберете пол для голосового ответа:', keyboard)
	}

	voiceSettingsVoices(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'voiceSettingsVoices')
		const keyboard = settingsKeyboard.voiceSettingsVoices()
		return ctx.editMessageText('Выберете персонажа, который озвучит ответ:', keyboard)
	}

	voiceSettingsRole(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'voiceSettingsRole')
		const keyboard = settingsKeyboard.voiceSettingsRole(telegramBot.userSettings.get('responseVoice'))
		return ctx.editMessageText('Выберете амплуа для персонажа:', keyboard)
	}

	voiceSettingsSpeed(ctx, menuState, settings) {
		menuState.set(ctx.from.id, 'voiceSettingsSpeed')
		const keyboard = settingsKeyboard.voiceSettingsSpeed()
		return ctx.editMessageText('Выберете скорость голосового ответа:', keyboard)
	}
}

export const settingsHandler = new SettingsHandler()
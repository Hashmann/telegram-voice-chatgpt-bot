import { settingsHandler } from './settings.handler.js'
import { backButton } from './backButton.handler.js'

class ButtonsHandler {
	async handleButton(ctx, menuState, settings) {
		const button = ctx.callbackQuery.data
		switch (button) {
			case 'Настройки ответа':
				settingsHandler.responseSettings(ctx, menuState, settings)
				break
			case 'Режим ответа':
				settingsHandler.responseSettingsMode(ctx, menuState, settings)
				break
			case 'Голосовой синтезатор':
				settingsHandler.responseSettingsApi(ctx, menuState, settings)
				break
			case 'Настройки синтезатора':
				settingsHandler.voiceSettingsYandex(ctx, menuState, settings)
				break
			case 'Язык':
				settingsHandler.voiceSettingsLanguage(ctx, menuState, settings)
				break
			case 'Пол':
				settingsHandler.voiceSettingsLanguageGender(ctx, menuState, settings)
				break
			case 'Персонаж':
				settingsHandler.voiceSettingsVoices(ctx, menuState, settings)
				break
			case 'Амплуа':
				settingsHandler.voiceSettingsRole(ctx, menuState, settings)
				break
			case 'Скорость':
				settingsHandler.voiceSettingsSpeed(ctx, menuState, settings)
				break
			case 'Меню настроек':
				settingsHandler.backToMainMenu(ctx, menuState)
				break
			case 'Назад':
				backButton.back(ctx, menuState, settings)
				break
		}
	}
}

export const buttonsHandler = new ButtonsHandler()
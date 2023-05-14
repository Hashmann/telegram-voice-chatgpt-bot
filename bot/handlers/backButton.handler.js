import { settingsKeyboard } from '../keyboards/settings.keyboard.js'


class BackButton {
	back(ctx, menuState, settings) {
		const state = menuState.get(ctx.from.id)
		// Response Settings Keyboard
		const ResponseSettingsKeyboard = settingsKeyboard.responseSettings()
		// voice Settings Yandex Keyboard
		const voiceSettingsYandexKeyboard = settingsKeyboard.voiceSettingsYandex()

		switch (state) {
			case 'responseSettings':
				menuState.set(ctx.from.id, 'mainMenu')
				ctx.editMessageText('Вы находитесь в главном меню настроек. Пожалуйста, выберите, интересующие настройки:', settingsKeyboard.mainMenu())
				break
			case 'responseSettingsMode':
				menuState.set(ctx.from.id, 'responseSettings')
				ctx.editMessageText('Настройки ответа от ChatGPT', ResponseSettingsKeyboard)
				break
			case 'responseSettingsApi':
				menuState.set(ctx.from.id, 'responseSettings')
				ctx.editMessageText('Настройки ответа от ChatGPT', ResponseSettingsKeyboard)
				break
			case 'voiceSettingsYandex':
				menuState.set(ctx.from.id, 'responseSettings')
				ctx.editMessageText('Настройки ответа от ChatGPT', ResponseSettingsKeyboard)
				break
			case 'voiceSettingsLanguage':
				menuState.set(ctx.from.id, 'voiceSettingsYandex')
				ctx.editMessageText('Выберете настройки для синтезатора речи:', voiceSettingsYandexKeyboard)
				break
			case 'voiceSettingsLanguageGender':
				menuState.set(ctx.from.id, 'voiceSettingsYandex')
				ctx.editMessageText('Выберете настройки для синтезатора речи:', voiceSettingsYandexKeyboard)
				break
			case 'voiceSettingsVoices':
				menuState.set(ctx.from.id, 'voiceSettingsYandex')
				ctx.editMessageText('Выберете настройки для синтезатора речи:', voiceSettingsYandexKeyboard)
				break
			case 'voiceSettingsRole':
				menuState.set(ctx.from.id, 'voiceSettingsYandex')
				ctx.editMessageText('Выберете настройки для синтезатора речи:', voiceSettingsYandexKeyboard)
				break
			case 'voiceSettingsSpeed':
				menuState.set(ctx.from.id, 'voiceSettingsYandex')
				ctx.editMessageText('Выберете настройки для синтезатора речи:', voiceSettingsYandexKeyboard)
				break
		}
	}
}

export const backButton = new BackButton()
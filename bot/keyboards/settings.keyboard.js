import { telegramBot } from '../bot.js'
import { yandexSpeech } from '../../api/yandexSpeech.api.js'
import { Markup } from 'telegraf'
import * as dotenv from 'dotenv'

dotenv.config({ path: `.env${process.env.NODE_ENV}` })

class SettingsKeyboard {
	bottomNavigation = [Markup.button.callback('🛠 Меню настроек', 'Меню настроек'), Markup.button.callback('👈🏽 Назад', 'Назад')] // ◄ 🔙

	// Main menu keyboard
	mainMenu() {
		return Markup.inlineKeyboard([
			[Markup.button.callback('Настройки голосового ответа...', 'Настройки ответа')],
			[Markup.button.callback('Настройки ChatGPT', 'Настройки ChatGPT')],
		])
	}

	// Response menu keyboard
	responseSettings() {
		const topLine = []
		const middleLine = []
		const bottomLine = []
		const responseMode = telegramBot.userSettings.get('responseMode')
		const responseVoiceApi = telegramBot.userSettings.get('responseVoiceApi')
		const userSettings = telegramBot.userSettings
		let hideSynthSetting = true
		let hideSynth = true
		if (responseMode === 'any' || responseMode === 'voice') hideSynth = false
		if (!hideSynth && responseVoiceApi === 'yandex' || !hideSynth && responseVoiceApi === 'any') hideSynthSetting = false

		if (userSettings.get('responseMode') === 'text') topLine.push(Markup.button.callback('Режим ответа: Текст', 'Режим ответа')) // ✓
		if (userSettings.get('responseMode') === 'voice') topLine.push(Markup.button.callback('Режим ответа: Голосом', 'Режим ответа')) // ✓
		if (userSettings.get('responseMode') === 'any') topLine.push(Markup.button.callback('Режим ответа: Текстом и голосом', 'Режим ответа')) // ✓

		if (userSettings.get('responseVoiceApi') === 'yandex') middleLine.push(Markup.button.callback('Голосовой синтезатор: Yandex', 'Голосовой синтезатор', hideSynth)) // ✓
		if (userSettings.get('responseVoiceApi') === 'google') middleLine.push(Markup.button.callback('Голосовой синтезатор: Google', 'Голосовой синтезатор', hideSynth)) // ✓
		if (userSettings.get('responseVoiceApi') === 'any') middleLine.push(Markup.button.callback('Голосовой синтезатор: Все', 'Голосовой синтезатор', hideSynth)) // ✓

		bottomLine.push(Markup.button.callback('Настройки синтезатора Yandex...', 'Настройки синтезатора', hideSynthSetting))
		return Markup.inlineKeyboard([topLine, middleLine, bottomLine, this.bottomNavigation])
	}

	// Response mode menu keyboard
	responseSettingsMode() {
		const topLine = []
		const bottomLine = []
		const userSettings = telegramBot.userSettings
		if (userSettings.get('responseMode') === 'text') {
			topLine.push(Markup.button.callback('✓ Текстом', 'Текстом'))
		} else {
			topLine.push(Markup.button.callback('Текстом', 'Текстом'))
		}
		if (userSettings.get('responseMode') === 'voice') {
			topLine.push(Markup.button.callback('✓ Голосом', 'Голосом'))
		} else {
			topLine.push(Markup.button.callback('Голосом', 'Голосом'))
		}
		if (userSettings.get('responseMode') === 'any') {
			bottomLine.push(Markup.button.callback('✓ Текстом и голосом', 'Текстом и голосом'))
		} else {
			bottomLine.push(Markup.button.callback('Текстом и голосом', 'Текстом и голосом'))
		}
		return Markup.inlineKeyboard([topLine, bottomLine, this.bottomNavigation])
	}

	// Response voice synthesizer api keyboard
	responseSettingsApi() {
		const yandexButton = []
		const googleButton = []
		const anyButton = []
		const userSettings = telegramBot.userSettings
		if (process.env.TEXT_TO_SPEECH_MODE === 'yandex') {
			if (userSettings.get('responseVoiceApi') === 'yandex') {
				yandexButton.push(Markup.button.callback('✓ Yandex', 'Yandex'))
			} else {
				yandexButton.push(Markup.button.callback('Yandex', 'Yandex'))
			}
		}
		if (process.env.TEXT_TO_SPEECH_MODE === 'google') {
			if (userSettings.get('responseVoiceApi') === 'google') {
				googleButton.push(Markup.button.callback('✓ Google', 'Google'))
			} else {
				googleButton.push(Markup.button.callback('Google', 'Google'))
			}
		}
		if (process.env.TEXT_TO_SPEECH_MODE === 'any') {
			if (userSettings.get('responseVoiceApi') === 'yandex') {
				yandexButton.push(Markup.button.callback('✓ Yandex', 'Yandex'))
			} else {
				yandexButton.push(Markup.button.callback('Yandex', 'Yandex'))
			}
			if (userSettings.get('responseVoiceApi') === 'google') {
				googleButton.push(Markup.button.callback('✓ Google', 'Google'))
			} else {
				googleButton.push(Markup.button.callback('Google', 'Google'))
			}
			if (userSettings.get('responseVoiceApi') === 'any') {
				anyButton.push(Markup.button.callback('✓ Все', 'Все синты'))
			} else {
				anyButton.push(Markup.button.callback('Все', 'Все синты'))
			}
		}
		return Markup.inlineKeyboard([yandexButton, googleButton, anyButton, this.bottomNavigation])
	}

	voiceSettingsYandex() {
		const topLine = []
		const middleLine = []
		const bottomLine = []
		const userSettings = telegramBot.userSettings
		if (userSettings.get('responseVoiceLanguage') === 'ru') topLine.push(Markup.button.callback('Язык: 🇷🇺 Русский', 'Язык'))
		if (userSettings.get('responseVoiceLanguage') === 'en') topLine.push(Markup.button.callback('Язык: 🇬🇧 English', 'Язык'))
		if (userSettings.get('responseVoiceLanguage') === 'de') topLine.push(Markup.button.callback('Язык: 🇩🇪 Deutsch', 'Язык'))
		if (userSettings.get('responseVoiceLanguage') === 'kk') topLine.push(Markup.button.callback('Язык: 🇰🇿 Қазақша', 'Язык'))
		if (userSettings.get('responseVoiceLanguage') === 'uz') topLine.push(Markup.button.callback('Язык: 🇺🇿 Ўзбек', 'Язык'))

		if (userSettings.get('responseVoiceGender') === 'male') middleLine.push(Markup.button.callback('Пол: Мужской', 'Пол'))
		if (userSettings.get('responseVoiceGender') === 'female') middleLine.push(Markup.button.callback('Пол: Женский', 'Пол'))

		if (userSettings.get('responseVoice') === 'filipp') middleLine.push(Markup.button.callback('Персонаж: Филипп', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'ermil') middleLine.push(Markup.button.callback('Персонаж: Эрмил', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'madirus') middleLine.push(Markup.button.callback('Персонаж: Мадирус', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'zahar') middleLine.push(Markup.button.callback('Персонаж: Захар', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'alena') middleLine.push(Markup.button.callback('Персонаж: Алёна', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'jane') middleLine.push(Markup.button.callback('Персонаж: Джейн', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'omazh') middleLine.push(Markup.button.callback('Персонаж: Омаж', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'lea') middleLine.push(Markup.button.callback('Персонаж: Леа', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'john') middleLine.push(Markup.button.callback('Персонаж: Джон', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'madi') middleLine.push(Markup.button.callback('Персонаж: Мади', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'amira') middleLine.push(Markup.button.callback('Персонаж: Амира', 'Персонаж'))
		if (userSettings.get('responseVoice') === 'nigora') middleLine.push(Markup.button.callback('Персонаж: Нигора', 'Персонаж'))

		if (userSettings.get('responseVoiceEmotion') === 'good') {
			if (userSettings.get('responseVoiceGender') === 'male') {
				bottomLine.push(Markup.button.callback('Амплуа: Радостный', 'Амплуа'))
			} else {
				bottomLine.push(Markup.button.callback('Амплуа: Радостная', 'Амплуа'))
			}
		}
		if (userSettings.get('responseVoiceEmotion') === 'neutral') {
			if (userSettings.get('responseVoiceGender') === 'male') {
				bottomLine.push(Markup.button.callback('Амплуа: Нейтральный', 'Амплуа'))
			} else {
				bottomLine.push(Markup.button.callback('Амплуа: Нейтральная', 'Амплуа'))
			}
		}
		if (userSettings.get('responseVoiceEmotion') === 'evil') {
			if (userSettings.get('responseVoiceGender') === 'male') {
				bottomLine.push(Markup.button.callback('Амплуа: Раздраженный', 'Амплуа'))
			} else {
				bottomLine.push(Markup.button.callback('Амплуа: Раздраженная', 'Амплуа'))
			}
		}

		if (userSettings.get('responseVoiceSpeed') === 'fast') bottomLine.push(Markup.button.callback('Скорость: Быстрая', 'Скорость'))
		if (userSettings.get('responseVoiceSpeed') === 'normal') bottomLine.push(Markup.button.callback('Скорость: Нормальная', 'Скорость'))
		if (userSettings.get('responseVoiceSpeed') === 'slow') bottomLine.push(Markup.button.callback('Скорость: Медленная', 'Скорость'))
		return Markup.inlineKeyboard([topLine, middleLine, bottomLine, this.bottomNavigation])
	}

	// Response voice language menu keyboard
	voiceSettingsLanguage() {
		const topLineButton = []
		const bottomLineButton = []
		const languages = yandexSpeech.voiceConfig
		const userSettings = telegramBot.userSettings
		for (let languageKey in languages) {
			if (languageKey !== 'allVoices') {
				if (languageKey === 'ru' || languageKey === 'en') {
					if (userSettings.get('responseVoiceLanguage') === languageKey) {
						topLineButton.push(Markup.button.callback(`✓ ${languages[languageKey].flag} ${languages[languageKey].title}`, languageKey))
					} else {
						topLineButton.push(Markup.button.callback(`${languages[languageKey].flag} ${languages[languageKey].title}`, languageKey))
					}
				} else {
					if (userSettings.get('responseVoiceLanguage') === languageKey) {
						bottomLineButton.push(Markup.button.callback(`✓ ${languages[languageKey].flag} ${languages[languageKey].title}`, languageKey))
					} else {
						bottomLineButton.push(Markup.button.callback(`${languages[languageKey].flag} ${languages[languageKey].title}`, languageKey))
					}
				}
			}
		}
		return Markup.inlineKeyboard([topLineButton, bottomLineButton, this.bottomNavigation])
	}

	voiceSettingsLanguageGender() {
		const languages = yandexSpeech.voiceConfig
		const userSettings = telegramBot.userSettings
		const responseVoiceLanguage = telegramBot.userSettings.get('responseVoiceLanguage')
		const gendersButtonTop = []
		const gendersButtonBottom = []
		for (let languageKey in languages) {
			const genders = languages[languageKey]
			if (languageKey === 'ru' && responseVoiceLanguage === 'ru') {
				for (let genderKey in genders) {
					if (genderKey === 'male') {
						if (userSettings.get('responseVoiceGender') === 'male') {
							gendersButtonTop.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonTop.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
					if (genderKey === 'female') {
						if (userSettings.get('responseVoiceGender') === 'female') {
							gendersButtonBottom.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonBottom.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
				}
			}
			if (languageKey === 'en' && responseVoiceLanguage === 'en') {
				for (let genderKey in genders) {
					if (genderKey === 'male') {
						if (userSettings.get('responseVoiceGender') === 'male') {
							gendersButtonTop.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonTop.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
					if (genderKey === 'female') {
						if (userSettings.get('responseVoiceGender') === 'female') {
							gendersButtonBottom.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonBottom.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
				}
			}
			if (languageKey === 'de' && responseVoiceLanguage === 'de') {
				for (let genderKey in genders) {
					if (genderKey === 'male') {
						if (userSettings.get('responseVoiceGender') === 'male') {
							gendersButtonTop.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonTop.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
					if (genderKey === 'female') {
						if (userSettings.get('responseVoiceGender') === 'female') {
							gendersButtonBottom.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonBottom.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
				}
			}
			if (languageKey === 'kk' && responseVoiceLanguage === 'kk') {
				for (let genderKey in genders) {
					if (genderKey === 'male') {
						if (userSettings.get('responseVoiceGender') === 'male') {
							gendersButtonTop.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonTop.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
					if (genderKey === 'female') {
						if (userSettings.get('responseVoiceGender') === 'female') {
							gendersButtonBottom.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonBottom.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
				}
			}
			if (languageKey === 'uz' && responseVoiceLanguage === 'uz') {
				for (let genderKey in genders) {
					if (genderKey === 'male') {
						if (userSettings.get('responseVoiceGender') === 'male') {
							gendersButtonTop.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonTop.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
					if (genderKey === 'female') {
						if (userSettings.get('responseVoiceGender') === 'female') {
							gendersButtonBottom.push(Markup.button.callback(`✓ ${genders[genderKey].title}`, `${genderKey}`))
						} else {
							gendersButtonBottom.push(Markup.button.callback(`${genders[genderKey].title}`, `${genderKey}`))
						}
					}
				}
			}
		}
		return Markup.inlineKeyboard([gendersButtonTop, gendersButtonBottom, this.bottomNavigation])
	}

	voiceSettingsVoices() {
		const voices = yandexSpeech.voiceConfig
		const responseVoiceLanguage = telegramBot.userSettings.get('responseVoiceLanguage')
		const responseVoiceGender = telegramBot.userSettings.get('responseVoiceGender')
		const voiceButtons = []
		if (responseVoiceLanguage === 'ru') {
			if (responseVoiceGender === 'male') {
				const male = voices.ru.male.voices
				for (let maleKey in male) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === maleKey) {
						text = `✓ ${male[maleKey].name}`
					} else {
						text = `${male[maleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${maleKey}`))
				}
			}
			if (responseVoiceGender === 'female') {
				const female = voices.ru.female.voices
				for (let femaleKey in female) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === femaleKey) {
						text = `✓ ${female[femaleKey].name}`
					} else {
						text = `${female[femaleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${femaleKey}`))
				}
			}
		}
		if (responseVoiceLanguage === 'en') {
			if (responseVoiceGender === 'male') {
				const male = voices.en.male.voices
				for (let maleKey in male) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === maleKey) {
						text = `✓ ${male[maleKey].name}`
					} else {
						text = `${male[maleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${maleKey}`))
				}
			}
			if (responseVoiceGender === 'female') {
				const female = voices.en.female.voices
				for (let femaleKey in female) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === femaleKey) {
						text = `✓ ${female[femaleKey].name}`
					} else {
						text = `${female[femaleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${femaleKey}`))
				}
			}
		}
		if (responseVoiceLanguage === 'de') {
			if (responseVoiceGender === 'male') {
				const male = voices.de.male.voices
				for (let maleKey in male) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === maleKey) {
						text = `✓ ${male[maleKey].name}`
					} else {
						text = `${male[maleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${maleKey}`))
				}
			}
			if (responseVoiceGender === 'female') {
				const female = voices.de.female.voices
				for (let femaleKey in female) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === femaleKey) {
						text = `✓ ${female[femaleKey].name}`
					} else {
						text = `${female[femaleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${femaleKey}`))
				}
			}
		}
		if (responseVoiceLanguage === 'kk') {
			if (responseVoiceGender === 'male') {
				const male = voices.kk.male.voices
				for (let maleKey in male) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === maleKey) {
						text = `✓ ${male[maleKey].name}`
					} else {
						text = `${male[maleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${maleKey}`))
				}
			}
			if (responseVoiceGender === 'female') {
				const female = voices.kk.female.voices
				for (let femaleKey in female) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === femaleKey) {
						text = `✓ ${female[femaleKey].name}`
					} else {
						text = `${female[femaleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${femaleKey}`))
				}
			}
		}
		if (responseVoiceLanguage === 'uz') {
			if (responseVoiceGender === 'male') {
				const male = voices.uz.male.voices
				for (let maleKey in male) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === maleKey) {
						text = `✓ ${male[maleKey].name}`
					} else {
						text = `${male[maleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${maleKey}`))
				}
			}
			if (responseVoiceGender === 'female') {
				const female = voices.uz.female.voices
				for (let femaleKey in female) {
					let text = ''
					if (telegramBot.userSettings.get('responseVoice') === femaleKey) {
						text = `✓ ${female[femaleKey].name}`
					} else {
						text = `${female[femaleKey].name}`
					}
					voiceButtons.push(Markup.button.callback(text, `${femaleKey}`))
				}
			}
		}
		return Markup.inlineKeyboard([voiceButtons, this.bottomNavigation])
	}

	voiceSettingsRole(voiceName) {
		const topButton = []
		const centerButton = []
		const bottomButton = []
		const allVoices = yandexSpeech.voiceConfig.allVoices
		const userSettings = telegramBot.userSettings
		const roles = allVoices[voiceName].role
		for (let rolesKey in roles) {
			if (rolesKey === 'good') {
				if (userSettings.get('responseVoiceEmotion') === 'good') {
					if (userSettings.get('responseVoiceGender') === 'male') {
						topButton.push(Markup.button.callback(`✓ Радостный`, 'Радостный'))
					} else {
						topButton.push(Markup.button.callback(`✓ Радостная`, 'Радостный'))
					}
				} else {
					if (userSettings.get('responseVoiceGender') === 'male') {
						topButton.push(Markup.button.callback(`Радостный`, 'Радостный'))
					} else {
						topButton.push(Markup.button.callback(`Радостная`, 'Радостный'))
					}
				}
			}
			if (rolesKey === 'neutral') {
				if (userSettings.get('responseVoiceEmotion') === 'neutral') {
					if (userSettings.get('responseVoiceGender') === 'male') {
						centerButton.push(Markup.button.callback(`✓ Нейтральный`, 'Нейтральный'))
					} else {
						centerButton.push(Markup.button.callback(`✓ Нейтральная`, 'Нейтральный'))
					}
				} else {
					if (userSettings.get('responseVoiceGender') === 'male') {
						centerButton.push(Markup.button.callback(`Нейтральный`, 'Нейтральный'))
					} else {
						centerButton.push(Markup.button.callback(`Нейтральная`, 'Нейтральный'))
					}
				}
			}
			if (rolesKey === 'evil') {
				if (userSettings.get('responseVoiceEmotion') === 'evil') {
					if (userSettings.get('responseVoiceGender') === 'male') {
						bottomButton.push(Markup.button.callback(`✓ Раздраженный`, 'Раздраженный'))
					} else {
						bottomButton.push(Markup.button.callback(`✓ Раздраженная`, 'Раздраженный'))
					}
				} else {
					if (userSettings.get('responseVoiceGender') === 'male') {
						bottomButton.push(Markup.button.callback(`Раздраженный`, 'Раздраженный'))
					} else {
						bottomButton.push(Markup.button.callback(`Раздраженная`, 'Раздраженный'))
					}
				}
			}
		}
		return Markup.inlineKeyboard([topButton, centerButton, bottomButton, this.bottomNavigation])
	}

	voiceSettingsSpeed() {
		const topButton = []
		const centerButton = []
		const bottomButton = []
		const userSettings = telegramBot.userSettings
		if (userSettings.get('responseVoiceSpeed') === 'fast') {
			topButton.push(Markup.button.callback(`✓ Быстрая`, 'Быстрая'))
		} else {
			topButton.push(Markup.button.callback(`Быстрая`, 'Быстрая'))
		}
		if (userSettings.get('responseVoiceSpeed') === 'normal') {
			centerButton.push(Markup.button.callback(`✓ Нормальная`, 'Нормальная'))
		} else {
			centerButton.push(Markup.button.callback(`Нормальная`, 'Нормальная'))
		}
		if (userSettings.get('responseVoiceSpeed') === 'slow') {
			bottomButton.push(Markup.button.callback(`✓ Медленная`, 'Медленная'))
		} else {
			bottomButton.push(Markup.button.callback(`Медленная`, 'Медленная'))
		}
		return Markup.inlineKeyboard([topButton, centerButton, bottomButton, this.bottomNavigation])
	}
}

export const settingsKeyboard = new SettingsKeyboard()
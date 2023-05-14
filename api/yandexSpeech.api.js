import { telegramBot } from '../bot/bot.js'
import { createReadStream, createWriteStream } from 'fs'
import { fileURLToPath, URLSearchParams } from 'url'
import { dirname, resolve } from 'path'
import { Logger } from '../utils/logger.utils.js'
import { config } from '../config/config.service.js'
import axios from 'axios'
import * as dotenv from 'dotenv'
import {utils} from "../utils/utils.js";

dotenv.config({ path: `.env${process.env.NODE_ENV}` })
const __dirname = dirname(fileURLToPath(import.meta.url))
const YANDEX_API_KEY = process.env.YANDEX_API_KEY

class YandexSpeech {
	// Text to speech config
	voiceConfig = {
		ru: {
			male: {
				voices: {
					// filipp: {
					// 	name: 'Филипп',
					// 	role: null
					// },
					ermil: {
						name: 'Эрмил',
						role: {
							neutral: 'neutral', // нейтральный
							good: 'good', // радостный
						}
					},
					madirus: {
						name: 'Мадирус',
						role: null
					},
					zahar: {
						name: 'Захар',
						role: {
							neutral: 'neutral', // нейтральный
							good: 'good', // радостный
						}
					},
				},
				title: 'Мужской'
			},
			female: {
				voices: {
					// alena: {
					// 	name: 'Алёна',
					// 	role: {
					// 		neutral: 'neutral', // нейтральная
					// 		good: 'good', // радостная
					// 	}
					// },
					jane: {
						name: 'Джейн',
						role: {
							neutral: 'neutral', // нейтральная
							good: 'good', // радостная
							evil: 'evil' // раздраженная
						}
					},
					omazh: {
						name: 'Омаж',
						role: {
							neutral: 'neutral', // нейтральная
							evil: 'evil' // раздраженная
						}
					},
				},
				title: 'Женский'
			},
			lang: 'ru-RU',
			title: 'Русский',
			flag: '🇷🇺'
		},
		de: {
			female: {
				voices: {
					lea: {
						name: 'Леа',
						role: null
					},
				},
				title: 'Женский'
			},
			lang: 'de-DE',
			title: 'Deutsch',
			flag: '🇩🇪'
		},
		en: {
			male: {
				voices: {
					john: {
						name: 'Джон',
						role: null
					},
				},
				title: 'Мужской'
			},
			lang: 'en-US',
			title: 'English',
			flag: '🇬🇧'
		},
		kk: {
			male: {
				voices: {
					madi: {
						name: 'Мади',
						role: null
					},
				},
				title: 'Мужской'
			},
			female: {
				voices: {
					amira: {
						name: 'Амира',
						role: null
					},
				},
				title: 'Женский'
			},
			lang: 'kk-KK', // казахский
			title: 'Қазақша',
			flag: '🇰🇿'
		},
		uz: {
			female: {
				voices: {
					nigora: {
						name: 'Нигора',
						role: null
					},
				},
				title: 'Женский'
			},
			lang: 'uz-UZ', // узбекский
			title: 'Ўзбек',
			flag: '🇺🇿'
		},
		allVoices: {
			// filipp: 'Филипп',
			ermil: {
				name: 'Эрмил',
				role: {
					neutral: 'neutral', // нейтральный
					good: 'good', // радостный
				}
			},
			madirus: {
				name: 'Мадирус',
				role: null
			},
			zahar: {
				name: 'Захар',
				role: {
					neutral: 'neutral', // нейтральный
					good: 'good', // радостный
				}
			},
			// alena: 'Алёна',
			jane: {
				name: 'Джейн',
				role: {
					neutral: 'neutral', // нейтральная
					good: 'good', // радостная
					evil: 'evil' // раздраженная
				}
			},
			omazh: {
				name: 'Омаж',
				role: {
					neutral: 'neutral', // нейтральная
					evil: 'evil' // раздраженная
				}
			},
			lea: {
				name: 'Леа',
				role: null
			},
			john: {
				name: 'Джон',
				role: null
			},
			madi: {
				name: 'Мади',
				role: null
			},
			amira: {
				name: 'Амира',
				role: null
			},
			nigora: {
				name: 'Нигора',
				role: null
			},
		}
	}

	constructor() {
		this.params = new URLSearchParams()
		this.params.append('text', 'Текст заглушка')
		this.params.append('voice', 'omazh')
		this.params.append('emotion', 'neutral')
		this.params.append('lang', 'ru-RU')
		this.params.append('speed', '1.4')
		this.params.append('format', 'oggopus')
	}
	// Speech to text
	async recognition(filePath) {
		try {
			const stream = createReadStream(filePath)
			let chunks = []
			stream.on('data', chunk => chunks.push(chunk))
			const data = stream.on('end',() => {
				return Buffer.concat(chunks)
			})

			const axiosConfig = {
				method: 'POST',
				url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
				headers: {
					Authorization: 'Api-Key ' + YANDEX_API_KEY
				},
				data: data
			}
			const responseYandex = await axios(axiosConfig)
			return responseYandex.data.result
		} catch (err) {
			Logger.error('YandexSpeech', 'yandexSpeech.api', '', err.message, 'ERROR')
		}
	}

	// Text to Speech
	async textToSpeech(userId, params, text) {
		try {
			const timestamp = Date.now()
			const filePath = resolve(__dirname, `../audio/response/${userId}`, `${userId}-${timestamp}.ogg`)

			if (this.params.get('text') !== text) this.params.set('text', text.split(`\n`).join(' ')) // .split(`\n`).join(' ')  // .replace(/\\n/g, '')
			// if (this.params.get('voice') !== params.get('responseVoice')) this.params.set('voice', params.get('responseVoice'))
			// if (this.params.get('emotion') !== params.get('responseVoiceEmotion')) this.params.set('emotion', params.get('responseVoiceEmotion'))
			// if (this.params.get('lang') !== params.get('responseLocale')) this.params.set('lang', params.get('responseLocale'))
			//
			// if (params.get('responseVoiceSpeed') === 'normal') this.params.set('speed', config.get('VOICE_SPEED_NORMAL'))
			// if (params.get('responseVoiceSpeed') === 'slow') this.params.set('speed', config.get('VOICE_SPEED_SLOW'))
			// if (params.get('responseVoiceSpeed') === 'fast') this.params.set('speed', config.get('VOICE_SPEED_FAST'))

			await this.setUserConfig(userId)

			const axiosConfig = {
				method: 'POST',
				url: 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
				data: this.params,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Api-Key ' + YANDEX_API_KEY
				},
				responseType: 'stream'
			}
			// Getting Yandex SpeechKit response file
			const file = await axios(axiosConfig)
			return new Promise(resolve => {
				const stream = createWriteStream(filePath)
				file.data.pipe(stream)
				stream.on('finish', () => resolve(filePath))
			})
		} catch (err) {
			Logger.error('textToSpeech', 'yandexSpeech.api', '', err.message, 'ERROR')
		}
	}

	resetDefaultLanguageVoiceSettings(languageCode) {
		const userSettings = telegramBot.userSettings
		switch (languageCode) {
			case 'ru':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'omazh')
				userSettings.set('responseVoiceEmotion', 'neutral')
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'ru-RU')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'en':
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'john')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'en-US')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'de':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'lea')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'de-DE')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'kk':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'amira')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'kk-KK')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'uz':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'nigora')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'uz-UZ')
				userSettings.set('responseVoiceApi', 'yandex')
				break
		}
	}

	resetDefaultVoiceSettings(voiceName) {
		const userSettings = telegramBot.userSettings
		switch (voiceName) {
			case 'ermil':
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'ermil')
				userSettings.set('responseVoiceEmotion', 'good')
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'ru-RU')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'madirus':
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'madirus')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'ru-RU')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'zahar':
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'zahar')
				userSettings.set('responseVoiceEmotion', 'good')
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'ru-RU')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'jane':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'jane')
				userSettings.set('responseVoiceEmotion', 'good')
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'ru-RU')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'omazh':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'omazh')
				userSettings.set('responseVoiceEmotion', 'neutral')
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'ru-RU')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'lea':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'lea')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'de-DE')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'john':
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'john')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'en-US')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'madi':
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'madi')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'kk-KK')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'amira':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'amira')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'kk-KK')
				userSettings.set('responseVoiceApi', 'yandex')
				break
			case 'nigora':
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'nigora')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseVoiceSpeed', 'normal')
				userSettings.set('responseLocale', 'uz-UZ')
				userSettings.set('responseVoiceApi', 'yandex')
				break
		}
	}

	resetDefaultGenderSettings(gender) {
		const userSettings = telegramBot.userSettings
		if (userSettings.get('responseVoiceLanguage') === 'ru') {
			if (gender === 'male') {
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'zahar')
				userSettings.set('responseVoiceEmotion', 'good')
				userSettings.set('responseLocale', 'ru-RU')
			}
			if (gender === 'female') {
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'jane')
				userSettings.set('responseVoiceEmotion', 'good')
				userSettings.set('responseLocale', 'ru-RU')
			}
		}
		if (userSettings.get('responseVoiceLanguage') === 'en') {
			if (gender === 'male') {
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'john')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseLocale', 'en-US')
			}
		}
		if (userSettings.get('responseVoiceLanguage') === 'de') {
			if (gender === 'female') {
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'lea')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseLocale', 'de-DE')
			}
		}
		if (userSettings.get('responseVoiceLanguage') === 'kk') {
			if (gender === 'male') {
				userSettings.set('responseVoiceGender', 'male')
				userSettings.set('responseVoice', 'madi')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseLocale', 'kk-KK')
			}
			if (gender === 'female') {
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'amira')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseLocale', 'kk-KK')
			}
		}
		if (userSettings.get('responseVoiceLanguage') === 'uz') {
			if (gender === 'female') {
				userSettings.set('responseVoiceGender', 'female')
				userSettings.set('responseVoice', 'nigora')
				userSettings.set('responseVoiceEmotion', null)
				userSettings.set('responseLocale', 'uz-UZ')
			}
		}
	}

	async setUserConfig(userId) {
		try {
			const userSettings = await utils.getSettings(userId)
			const settings = userSettings.settings
			for (let settingsKey in settings) {
				// if (settings[settingsKey] !== this.userSettings.get(settingsKey)) this.userSettings.set(settingsKey, settings[settingsKey])
				if (settingsKey === 'responseVoice') this.params.set('voice', settings[settingsKey])
				if (settingsKey === 'responseVoiceEmotion') this.params.set('emotion', settings[settingsKey])
				if (settingsKey === 'responseLocale') this.params.set('lang', settings[settingsKey])
				if (settingsKey === 'responseVoiceSpeed') this.params.set('lang', settings[settingsKey])

				if (settings[settingsKey] === 'normal') this.params.set('speed', config.get('VOICE_SPEED_NORMAL'))
				if (settings[settingsKey] === 'slow') this.params.set('speed', config.get('VOICE_SPEED_SLOW'))
				if (settings[settingsKey] === 'fast') this.params.set('speed', config.get('VOICE_SPEED_FAST'))
			}
			Logger.info('Set User Config', 'yandexSpeech.api', '', 'DONE', 'v')
		} catch (err) {
			Logger.error('Set User Config', 'yandexSpeech.api', '', err.message, 'ERROR')
		}
	}
}

export const yandexSpeech = new YandexSpeech()
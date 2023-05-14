import { createWriteStream } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { utils } from './utils.js'
import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'
import { Logger } from './logger.utils.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

class OggToMp3Converter {
	constructor() {
		ffmpeg.setFfmpegPath(installer.path)
	}

	// Converting .ogg file to .mp3
	async convert(url, fileName) {
		try {
			const fileNamePath = resolve(dirname(url), `${fileName}.mp3`)
			return new Promise((resolve, reject) => {
				ffmpeg(url).inputOption('-t 30').output(fileNamePath)
					.on('end', () => {
						utils.deleteFile(url)
						resolve(fileNamePath)
					})
					.on('error', err => reject(err.message))
					.run()
			})
		} catch (err) {
			Logger.error('Converting file', 'converter.utils', '', err.message, 'ERROR')
		}
	}

	// Getting and saving a file .ogg to disk in the 'audio' directory
	async create(url, fileName, timestamp) {
		try {
			const filePath = resolve(__dirname, `../audio/request/${fileName}`, `${fileName}-${timestamp}.ogg`)
			const file = await axios({method: 'get', url, responseType: 'stream'})
			return new Promise(resolve => {
				const stream = createWriteStream(filePath)
				file.data.pipe(stream)
				stream.on('finish', () => resolve(filePath))
			})
		} catch (err) {
			Logger.error('Creating file', 'converter.utils', '', err.message, 'ERROR')
		}
	}
}

export const oggToMp3Converter = new OggToMp3Converter()
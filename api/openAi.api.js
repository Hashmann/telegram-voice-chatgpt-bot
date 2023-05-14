import { Configuration, OpenAIApi } from 'openai'
import { createReadStream } from 'fs'
import * as dotenv from 'dotenv'
import {Logger} from "../utils/logger.utils.js";

dotenv.config({ path: `.env${process.env.NODE_ENV}` })
const API_KEY = process.env.OPENAI_API_KEY

class OpenAI {
	roles = {
		SYSTEM: 'system',
		USER: 'user',
		ASSISTANT: 'assistant'
	}
	constructor(apiKey) {
		const configuration = new Configuration({
			apiKey,
		})
		this.openai = new OpenAIApi(configuration)
	}

	// Getting ChatGPT response
	async chat(messages) {
		try {
			const response = await this.openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages,
			})
			return response.data.choices[0].message
		} catch (err) {
			Logger.error('Request to ChatGPT', 'openAi.api', '', err.message, 'ERROR')
		}
	}

	// Translating .mp3 to text
	async speechToText(filePath) {
		try {
			const response = await this.openai.createTranscription(createReadStream(filePath), 'whisper-1')
			return response.data.text
		} catch (err) {
			Logger.error('Speech to text', 'openAi.api', '', err.message, 'ERROR')
		}
	}

	async getPicture(message) {

	}
}

export const openAi = new OpenAI(API_KEY)
<h1 align="center">Voice ChatGPT telegram bot</h1>

<p align="center">
  <img src="logo.png"  alt="Express">
</p>

<p align="center">
   <img src="https://img.shields.io/badge/NodeJS-18.13-green" alt="Node Version">
   <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

<div align="center"><h2>

About: [^1]
</h2></div>

Telegram bot for voice communication with ChatGPT. The user sends a voice or text message to the bot and receives a text or voice message in response from ChatGPT. It is written in JavaScript and uses NodeJS.

<div align="center"><h3>

Features: [^2]
</h2></div>

- [x] The ability to choose a service for converting voice to text: using `OpenAI API` or `YandexSpeechKit API`
- [x] Converting `.mp3 to text`: using `OpenAI API`.
- [x] Converting `.ogg to text`: using `YandexSpeechKit API`
- [x] Converting `.ogg to .mp3`: using `fluent-ffmpeg`.
- [x] The user can choose how best to get an answer: by `text`, by `voice`, or all together.
- [x] To convert text to voice message: using `YandexSpeechKit API` or `Google`
- [x] ChatGPT remembers the context
- [x] Whitelist of users who have access to the bot.
- [x] Collecting simple statistics that includes the total number of requests, the number of voice requests, the number of text requests, the total number of words in all requests.
- [x] The ability for users to see their statistics.
- [x] Voice messages and text history chat are not saved on the server if the corresponding option is enabled
- [x] The database is not used, all statistics and data are stored in `.json` format.
> :warning: **If the bot work with a large audience, it is better to use a database.**


<div align="center"><h2>

Installation: [^3]
</h2></div>

```
$ git clone https://github.com/Hashmann/telegram-voice-chatgpt-bot.git
$ cd server
```
- Edit `.env.production` `.env.development` and set your telegram bot token and OpenAI key.
- Edit `whitelist.user.json` and add the usernames to the whitelist.
```
$ npm install
```

<!-- <ul>
<li><code>test</code></li>
</ul> -->

> :warning: **Do not delete directories:** `audio` and `log`

<div align="center"><h2>

Usage: [^4]
</h2></div>


<details>
  <summary>Development</summary>

```
$ npm run start:dev
```
</details>

<details>
  <summary>Production</summary>

```
$ npm run start
```
</details>

<div align="center"><h2>

Dependencies: [^5]
</h2></div>

<details>
  <summary>Development</summary>

- [Nodemon](https://www.npmjs.com/package/nodemon) ^2.0.20
</details>

<details>
  <summary>Production</summary>

- [Dotenv (npm)](https://www.npmjs.com/package/dotenv) ^16.0.3
</details>

<!--
<div align="center"><h2>

[^6] TODO:
</h2></div>

<details>
  <summary>List one</summary>

- [ ] Todo1
- [ ] Todo2
- [ ] Todo3
</details>

<details>
  <summary>List two</summary>

- [ ] Todo4
- [ ] Todo5
- [ ] Todo6
</details>
-->

<div align="center"><h2>Developer:</h2></div>

[Yarkov Vyacheslav](https://github.com/Hashmann)

<div align="center"><h2>License:</h2></div>

[MIT license](https://opensource.org/licenses/MIT)


[^1]: About
[^2]: Features
[^3]: Installation
[^4]: Usage
[^5]: Dependencies
[^6]: TODO

<div align="center"><sub align="center">May 2023</sub></div>

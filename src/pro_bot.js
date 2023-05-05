import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'
import config from 'config'
import { ogg } from './ogg.js'
import { openai } from './openai.js'

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"))

// Отслеживаем голосовые сообщения и отправляем запрос в OpenAI API
bot.on(message('voice'), async (ctx) => {
try {
// Отправляем пользователю сообщение о том, что запрос генерируется
    await ctx.reply(code('Запрос генерируется...'))

// Получаем ссылку на файл голосового сообщения
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)

// Получаем идентификатор пользователя
    const userId = String(ctx.message.from.id)

// Преобразуем голосовое сообщение в ogg формат
    const oggPath = await ogg.create(link.href, userId)

// Преобразуем ogg формат в mp3 формат
    const mp3Path = await ogg.toMp3(oggPath, userId)

// Преобразуем голосовой текст в текстовую строку
    const text = await openai.transcription(mp3Path)

// Отправляем пользователю сообщение с запросом
    await ctx.reply(code(`Ваш запрос: ${text}`))

// Создаем массив сообщений для отправки в OpenAI API
    const messages = [{ role: openai.roles.USER, content: text }]

// Отправляем сообщения в OpenAI API и получаем ответ
    const response = await openai.chat(messages)

// Отправляем пользователю ответ от OpenAI API
    await ctx.reply(response.content)
} catch (e) {
// Обрабатываем ошибку, если она возникла в ходе выполнения запроса
    if (e.code === 400 && e.response && e.response.description === 'Bad Request: message text is empty') {
// Отправляем пользователю сообщение об ошибке
    await ctx.reply('Ошибка: Вы отправили голосовое сообщение без текстового комментария. Пожалуйста, повторите попытку и добавьте текстовый комментарий к голосовому сообщению.')
    } else {
// Логируем ошибку, если она не относится к голосовым сообщениям без текстового комментария
    console.log(`Error while voice message`, e.message)
    }
}
})

// Отслеживаем текстовые сообщения и отправляем запрос в OpenAI API
bot.on('message', async (ctx) => {
try {

// Отправляем пользователю сообщение о том, что запрос генерируется
    await ctx.reply(code('Запрос генерируется...'))
    
// Получаем текст сообщения
    const text = ctx.message.text

    // Создаем массив сообщений для отправки в OpenAI API
    const messages = [{ role: openai.roles.USER, content: text }]

// Отправляем сообщения в OpenAI API и получаем ответ
    const response = await openai.chat(messages)

    // Отправляем сообщения в OpenAI API и получаем ответ
    await ctx.reply(code(`Ваш запрос: ${text}`))

// Эта строка отправляет ответ от OpenAI API пользователю в чате
    await ctx.reply(response.content)
    
} catch (e) {
    // Логируем ошибку, если что-то пошло не так при отправке текстового сообщения
    console.log(`Error while text message`, e.message)
}
})

// Запускаем бота и логируем сообщение о том, что он запущен
bot.launch()

// Останавливаем бота при получении сигнала SIGINT или SIGTERM
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// Логируем сообщение о том, что бот запущен
console.log(" Я живой ! ")


// import { Telegraf } from 'telegraf'
// import { message } from 'telegraf/filters'
// import { code  } from 'telegraf/format'
// import config  from 'config'
// import  { ogg } from './ogg.js'
// import  { openai } from './openai.js'

// const bot = new Telegraf(config.get("TELEGRAM_TOKEN"))

// bot.on(message('voice'), async (ctx) => {
//     try {
//         await ctx.reply(code('Запрос генерируеться...'))
//         const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
//         const userId = String(ctx.message.from.id)
//         const oggPath = await ogg.create(link.href, userId)
//         const mp3Path = await ogg.toMp3(oggPath, userId)

//         const text = await openai.transcription(mp3Path)
//         await ctx.reply(code(`Ваш запрос: ${text}`))
        
//         const messages = [{role: openai.roles.USER, content: text}]
//         const response = await openai.chat(messages)

//         await ctx.reply(response.content)
//         } catch (e) {
//             if (e.code === 400 && e.response && e.response.description === 'Bad Request: message text is empty') {
//               // Отправляем пользователю сообщение об ошибке
//             await ctx.reply('Ошибка: Вы отправили голосовое сообщение без текстового комментария. Пожалуйста, повторите попытку и добавьте текстовый комментарий к голосовому сообщению.')
//             } else {
//             console.log(`Error while voice message`, e.message)
//             }
//         }
// })



// bot.launch()

// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))


// // bot.command('start', (ctx) => {
// //     const buttons = [
// //         { text: 'Кнопка 1', callback_data: 'button1' },
// //         { text: 'Кнопка 2', callback_data: 'button2' },
// //         { text: 'Кнопка 3', callback_data: 'button3' },
// //         { text: 'Кнопка 4', callback_data: 'button4' },
// //     ];
// //     ctx.reply('Выберите кнопку', {
// //         reply_markup: {
// //         inline_keyboard: [buttons],
// //         },
// //     });
// // });
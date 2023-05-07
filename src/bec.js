// import { Telegraf, session} from 'telegraf'
// import { message } from 'telegraf/filters'
// import { code } from 'telegraf/format'
// import config from 'config'
// import { ogg } from './ogg.js'
// import { openai } from './openai.js'

// const INITIAL_SESSION = {
//     messages: [],
// }
// const bot = new Telegraf(config.get("TELEGRAM_TOKEN"))
// bot.use(session())

// bot.command('start', async(ctx) => {
//     try {
//         ctx.session = INITIAL_SESSION
//         const buttons = [
//                     { text: 'Кнопка 1', callback_data: 'button1' },
//                     { text: 'Кнопка 2', callback_data: 'button2' },
//                     { text: 'Кнопка 3', callback_data: 'button3' },
//                     { text: 'Кнопка 4', callback_data: 'button4' },
//                 ];
//                 await ctx.reply('Привет! Я pro_bot - бот с искусственным интеллектом, созданный на базе GPT-chat. Вы всегда можете сразу задать вопрос голосовым или текстовым сообщением, или выбрать нужного бота из меню', {
//                     reply_markup: {
//                     inline_keyboard: [buttons],
//                     },
//                 });
//     } catch (e) {
//         console.log(`Error while start message`, e.message)
//     }
// })
// //КНОПКА 
// bot.action('button1', async (ctx) => {
//     try {
//         await ctx.answerCbQuery()
//         ctx.replyWithHTML('Кнопка 1 отработана', {
//             disable_web_page_preview: true
//         })
//     } catch (e) {
//         console.log(`Error while button1`, e.message)
//     }
// })

// bot.action('button2', async (ctx) => {
//     try {
//         await ctx.answerCbQuery()
//         ctx.replyWithHTML('Кнопка 2 отработана', {
//             disable_web_page_preview: true
//         })
//     } catch (e) {
//         console.log(`Error while button2`, e.message)
//     }
// } )


// function addActionBot(name, src, text) {
//     bot.action(name, async (ctx) => {
//         try {
//             await ctx.answerCbQuery()
//             if(src !== false) {
//                 await ctx.replyWithPhoto({
//                     source: src
//                 })
//             }
//             await ctx.replyWithHTML(text, {
//                 disable_web_page_preview: true
//             })
//         } catch (e) {
//             console.log(`Error while funcvion addActionBot`, e.message)
//         }
//     })
// }

// addActionBot('button1',)

// bot.on(message('voice'), async (ctx) => {// Отслеживаем голосовые сообщения и отправляем запрос в OpenAI API
//     ctx.session ??= INITIAL_SESSION
// try {
//     await ctx.reply(code('Запрос генерируется...')) // Отправляем пользователю сообщение о том, что запрос генерируется

//     const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id) // Получаем ссылку на файл голосового сообщения
//     const userId = String(ctx.message.from.id) // Получаем идентификатор пользователя
//     const oggPath = await ogg.create(link.href, userId) // Преобразуем голосовое сообщение в ogg формат
//     const mp3Path = await ogg.toMp3(oggPath, userId)// Преобразуем ogg формат в mp3 формат
//     const text = await openai.transcription(mp3Path) // Преобразуем голосовой текст в текстовую строку

//     await ctx.reply(code(`Ваш запрос: ${text}`)) // Отправляем пользователю сообщение с запросом

//     ctx.session.messages.push({ role: openai.roles.USER, content: text }) // Создаем массив сообщений для отправки в OpenAI API
    
//     const response = await openai.chat(ctx.session.messages) // Отправляем сообщения в OpenAI API и получаем ответ

//     ctx.session.messages.push({
//         role: openai.roles.ASSISTANT,
//         content: response.content,
//     })
//     await ctx.reply(response.content) // Отправляем пользователю ответ от OpenAI API
// } catch (e) {
//     if (e.code === 400 && e.response && e.response.description === 'Bad Request: message text is empty') {// Обрабатываем ошибку, если она возникла в ходе выполнения запроса
//     await ctx.reply('Ошибка: Вы отправили голосовое сообщение без текстового комментария. Пожалуйста, повторите попытку и добавьте текстовый комментарий к голосовому сообщению.') // Отправляем пользователю сообщение об ошибке
//     } else {
//     console.log(`Error while voice message`, e.message) // Логируем ошибку, если она не относится к голосовым сообщениям без текстового комментария
//     }
// } 
// })

// bot.on('message', async (ctx) => {// Отслеживаем текстовые сообщения и отправляем запрос в OpenAI API
// try {
//     await ctx.reply(code('Запрос генерируется...')) // Отправляем пользователю сообщение о том, что запрос генерируется
//     const text = ctx.message.text // Получаем текст сообщения
//     const messages = [{ role: openai.roles.USER, content: text }]// Создаем массив сообщений для отправки в OpenAI API
//     const response = await openai.chat(messages) // Отправляем сообщения в OpenAI API и получаем ответ
//     await ctx.reply(code(`Ваш запрос: ${text}`))    // Отправляем сообщения в OpenAI API и получаем ответ
//     await ctx.reply(response.content)// Эта строка отправляет ответ от OpenAI API пользователю в чате
// } catch (e) {
//     console.log(`Error while text message`, e.message)// Логируем ошибку, если что-то пошло не так при отправке текстового сообщения
// }
// })
// bot.launch() // Запускаем бота и логируем сообщение о том, что он запущен
// process.once('SIGINT', () => bot.stop('SIGINT')) // Останавливаем бота при получении сигнала SIGINT или SIGTERM
// process.once('SIGTERM', () => bot.stop('SIGTERM'))
// console.log(" Бот запущен . . .  ") // Логируем сообщение о том, что бот запущен
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



11.05.23
import { Telegraf, session } from 'telegraf'; // Импортируем классы Telegraf и session из пакета telegraf
import { message } from 'telegraf/filters'; // Импортируем класс message из пакета telegraf/filters
import { code } from 'telegraf/format'; // Импортируем класс code из пакета telegraf/format
import config from 'config'; // Импортируем модуль config
import { ogg } from './ogg.js'; // Импортируем модуль ogg из файла ./ogg.js
import { openai } from './openai.js'; // Импортируем модуль openai из файла ./openai.js
//const textSrat = require('./const.js')


const INITIAL_SESSION = {
messages: [],
};

const bot = new Telegraf(config.get("TELEGRAM_TOKEN")); // Создаем экземпляр класса Telegraf и передаем ему токен из config
bot.use(session()); // Подключаем сессии к боту

bot.command('start', async (ctx) => { // Обработчик команды /start
try {
    ctx.session = INITIAL_SESSION; // Устанавливаем начальное значение сессии

    ctx.replyWithHTML(`<i>У утки нет истории...</i>`); // Отправляем HTML-сообщение с использованием тега <i>
    //await ctx.replyWithPhoto({ source: { filename: './img./O.jpeg' } }); //отправка фото
    const buttons = [
      { text: 'Кнопка 1', callback_data: 'button1' }, // Кнопка 1 с текстом "Кнопка 1" и колбэк-данными "button1"
      { text: 'Кнопка 2', callback_data: 'button2' }, // Кнопка 2 с текстом "Кнопка 2" и колбэк-данными "button2"
      { text: 'Кнопка 3', callback_data: 'button3' }, // Кнопка 3 с текстом "Кнопка 3" и колбэк-данными "button3"
      { text: 'Кнопка 4', callback_data: 'button4' }, // Кнопка 4 с текстом "Кнопка 4" и колбэк-данными "button4"
    ];

    await ctx.reply('Привет! Я pro_bot - бот с искусственным интеллектом, созданный на базе GPT-chat. Вы всегда можете сразу задать вопрос голосовым или текстовым сообщением, или выбрать нужного бота из меню', {
    reply_markup: {
        inline_keyboard: [buttons], // Используем массив кнопок в качестве встроенной клавиатуры
    },
    });
} catch (e) {
    console.log(`Error while start message`, e.message); // Выводим ошибку, если возникла ошибка при выполнении команды /start
}
});


function addActionBot(name, src, text) {
    bot.action(name, async (ctx) => { // Обработчик для указанного имени действия
        try {
            await ctx.answerCbQuery(); // Отправка подтверждения для inline-кнопки
            if (src !== false) { // Проверка, если src не равно false
                await ctx.replyWithPhoto({ // Отправка фото
                    source: src, // Путь к исходному файлу фото
                });
            }
            await ctx.replyWithHTML(text, { // Отправка текста с HTML-разметкой
                disable_web_page_preview: true, // Отключение предварительного просмотра ссылок
            });
        } catch (e) {
            console.log(`ошибка в функции function addActionBot`, e.message); // Вывод ошибки в консоль
        }
    });
}

bot.command('help', (ctx) => {
    const helpText = `
<pre>🎙️ Вот как я могу быть полезен:

1️⃣ Голосовые сообщения: Вы можете просто отправить мне голосовое сообщение, и я преобразую его в текст и отвечу на ваш вопрос.

2️⃣ Текстовые сообщения: Вы можете написать мне текстовое сообщение, и я смогу ответить на него, используя свои навыки и знания.

🌟 Почему стоит использовать меня:

- Быстрый и удобный способ получить ответы на ваши вопросы.
- Возможность использования голосовых сообщений, если вам удобнее говорить, а не писать.
- Широкий спектр тем, на которые я могу ответить, благодаря базе знаний и навыкам GPT.

Просто задайте свой вопрос или отправьте голосовое сообщение, и я постараюсь помочь вам! 🌐</pre>`;

    ctx.replyWithHTML(helpText);
});



bot.on(message('voice'), async (ctx) => {// Отслеживаем голосовые сообщения и отправляем запрос в OpenAI API
    ctx.session ??= INITIAL_SESSION
try {
    await ctx.reply(code('Запрос генерируется...')) // Отправляем пользователю сообщение о том, что запрос генерируется

    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id) // Получаем ссылку на файл голосового сообщения
    const userId = String(ctx.message.from.id) // Получаем идентификатор пользователя
    const oggPath = await ogg.create(link.href, userId) // Преобразуем голосовое сообщение в ogg формат
    const mp3Path = await ogg.toMp3(oggPath, userId)// Преобразуем ogg формат в mp3 формат
    const text = await openai.transcription(mp3Path) // Преобразуем голосовой текст в текстовую строку

    await ctx.reply(code(`Ваш запрос: ${text}`)) // Отправляем пользователю сообщение с запросом

    ctx.session.messages.push({ role: openai.roles.USER, content: text }) // Создаем массив сообщений для отправки в OpenAI API
    
    const response = await openai.chat(ctx.session.messages) // Отправляем сообщения в OpenAI API и получаем ответ

    ctx.session.messages.push({
        role: openai.roles.ASSISTANT,
        content: response.content,
    })
    await ctx.reply(response.content) // Отправляем пользователю ответ от OpenAI API
} catch (e) {
    if (e.code === 400 && e.response && e.response.description === 'Bad Request: message text is empty') {// Обрабатываем ошибку, если она возникла в ходе выполнения запроса
    await ctx.reply('Ошибка: Вы отправили голосовое сообщение без текстового комментария. Пожалуйста, повторите попытку и добавьте текстовый комментарий к голосовому сообщению.') // Отправляем пользователю сообщение об ошибке
    } else {
    console.log(`Error while voice message`, e.message) // Логируем ошибку, если она не относится к голосовым сообщениям без текстового комментария
    }
} 
})

bot.on('message', async (ctx) => {// Отслеживаем текстовые сообщения и отправляем запрос в OpenAI API
try {
    await ctx.reply(code('Запрос генерируется...')) // Отправляем пользователю сообщение о том, что запрос генерируется 

    const text = ctx.message.text // Получаем текст сообщения
    const messages = [{ role: openai.roles.USER, content: text }]// Создаем массив сообщений для отправки в OpenAI API
    const response = await openai.chat(messages) // Отправляем сообщения в OpenAI API и получаем ответ

    await ctx.reply(code(`Ваш запрос: ${text}`)) // Отправляем пользователю сообщение Ваш запрос:
    await ctx.reply(response.content)// Эта строка отправляет ответ от OpenAI API пользователю в чате
} catch (e) {
    console.log(`Error while text message`, e.message)// Логируем ошибку, если что-то пошло не так при отправке текстового сообщения
}
})
bot.launch() // Запускаем бота и логируем сообщение о том, что он запущен
process.once('SIGINT', () => bot.stop('SIGINT')) // Останавливаем бота при получении сигнала SIGINT или SIGTERM
process.once('SIGTERM', () => bot.stop('SIGTERM'))
console.log(" Бот запущен . . .  ") // Логируем сообщение о том, что бот запущен

//Код из видео ( переключение между сессиями )
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
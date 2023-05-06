try {

} catch (e) {
    console.log(`Error while funcvion addActionBot`, e.message)
}


bot.command('start', (ctx) => {
    ctx.replyWithHTML('<b>Жирный</b>')
    ctx.replyWithHTML('<i>Курсив</i>')
    ctx.replyWithHTML('<u>Подчёркнутый</u>')
    ctx.replyWithHTML('<s>Зачёркнутый</s>')

    ctx.replyWithHTML('<code>Моноширинный</code>') 
    //или
    ctx.reply(code('Запрос генерируется...'))

    ctx.replyWithHTML('<a href="https://google.com">Ссылка</a>')
})

bot.command('button', (ctx) => {
    const buttons = [
        { text: 'Кнопка 1', callback_data: 'button1' },
        { text: 'Кнопка 2', callback_data: 'button2' },
        { text: 'Кнопка 3', callback_data: 'button3' },
        { text: 'Кнопка 4', callback_data: 'button4' },
    ];
    ctx.reply('Привет! Я pro_bot - бот с искусственным интеллектом, созданный на базе GPT-chat. Вы всегда можете сразу задать вопрос голосовым или текстовым сообщением, или выбрать нужного бота из меню', {
        reply_markup: {
        inline_keyboard: [buttons],
        },
    });
});

bot.action('no')


await ctx.answerCbQuery() // убирает загрузку в виде часиков на кнопке 


bot.command('help', (ctx) => {
    const helpText = `
    Привет! Я pro_bot - бот с искусственным интеллектом, созданный на базе GPT-chat. Я могу обрабатывать не только текстовые сообщения, но и голосовые.
    
    Вот как я могу быть полезен:
    
    1. Голосовые сообщения: Вы можете просто отправить мне голосовое сообщение, и я преобразую его в текст и отвечу на ваш вопрос.
    
    2. Текстовые сообщения: Вы можете написать мне текстовое сообщение, и я смогу ответить на него, используя свои навыки и знания.
    
    Почему стоит использовать меня:
    
    - Быстрый и удобный способ получить ответы на ваши вопросы.
    - Возможность использования голосовых сообщений, если вам удобнее говорить, а не писать.
    - Широкий спектр тем, на которые я могу ответить, благодаря базе знаний и навыкам GPT.
    
    Просто задайте свой вопрос или отправьте голосовое сообщение, и я постараюсь помочь вам!`;
ctx.reply(helpText);
    });


    bot.action('button1', async (ctx) => {
        try {
    
        } catch (e) {
            console.log(`Error while button1`, e.message)
        }
    } )
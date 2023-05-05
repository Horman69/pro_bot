import { Configuration,OpenAIApi } from "openai" // Импортируем модули из библиотеки OpenAI
import config from "config"; // Импортируем модуль с конфигурационными данными
import { createReadStream } from "fs"; // Импортируем модуль для чтения файлов
import { message } from "telegraf/filters"; // Импортируем фильтр сообщений из библиотеки telegraf

class OpenAi {
    roles = { // Объект с ролями
        ASSISTANT: 'assistant', // Ассистент
        USER: 'user', // Пользователь
        SYSTEM: 'system', // Система
    }

    constructor(apiKey) { // Конструктор класса, принимающий API-ключ
        const configuration = new Configuration({ // Создание объекта конфигурации для OpenAI
            apiKey, // Передача API-ключа в конфигурацию
    });
    this.openai = new OpenAIApi(configuration); // Создание объекта API OpenAI
}

    async chat(messages) { // Метод для отправки сообщений в чат
        try {
    const response = await this.openai.createChatCompletion({ // Создание запроса на обработку сообщений OpenAI
        model: 'gpt-3.5-turbo', // Модель для обработки сообщений
        messages, // Сообщения для обработки
    })
    return response.data.choices[0].message // Возвращаем первый ответ из ответов OpenAI
        } catch (e) {
            console.log('Error white gpt cahat', e.message) // Логируем ошибку
        }
    }

    async transcription (filepath) { // Метод для транскрибации аудиофайлов
        try {
            const respose = await this.openai.createTranscription( // Создание запроса на транскрибацию аудиофайла OpenAI
                createReadStream(filepath), // Чтение файла из директории
                'gpt-3.5-turbo', // Модель для транскрибации
                messages, // Сообщения для транскрибации
            )
            return respose.data.text // Возвращаем текст транскрибации
            await this.openai.createTranscription() // Повторно создаём запрос на транскрибацию
        } catch (e) {
            console.log(`Error while transcription`, e.message) // Логируем ошибку
        }
    }
}


export const openai = new OpenAi(config.get('OPENAI_KEY')) // Экспортируем объект OpenAI с API-ключом из конфигурационных данных.

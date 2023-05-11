// Подключение необходимых модулей и библиотек
import axios from "axios"
import ffmpeg from "fluent-ffmpeg"
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { removeFile } from "./utils.js"

// Получение текущей директории
const __dirname = dirname(fileURLToPath(import.meta.url))

class OggConvector {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path) // Установка пути к FFmpeg
    }

// Конвертация OGG в MP3
toMp3(input, output) {
    try {
        const outputPath = resolve(dirname(input), `${output}.mp3`); // Путь к выходному MP3-файлу
        return new Promise((resolve, reject) => {
            ffmpeg(input)
                .inputOption('-t 30') // обрезать до 30 секунд
                .output(outputPath)
                .on('end', () => {
                    
                    removeFile(input); // Удалить исходный файл
                    resolve(outputPath); // Вернуть путь к созданному MP3
                })
                .on('error', (err) => reject(err.message))
                .run();
        });
    } catch (e) {
        console.log('Error while creating mp3', e.message);
    }
}
// Создание файла OGG из URL
    async create(url, filename) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`) // Путь к создаваемому файлу OGG
            const response = await axios({
                method: 'get',
                url,
                responseType: 'stream',
            })
            return new Promise((resolve) => {
                const stream = createWriteStream(oggPath) // Создать поток для записи файла
                response.data.pipe(stream) // Записать данные из потока ответа в поток записи
                stream.on('finish', () => resolve(oggPath))// По завершению записи вернуть путь к созданному OGG-файлу
                
            }) 
        } catch (e) {
            console.log('Error while creating ogg', e.message)  // Вывести ошибку в консоль, если что-то пошло не так
        }
    }
}

// Экспорт созданного объекта OggConverter
export const ogg = new OggConvector()
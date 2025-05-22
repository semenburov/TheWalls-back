import { ITelegramProfile } from '@/auth/social-media/social-media-auth.types' // Тип профілю Telegram
import { ConfigService } from '@nestjs/config' // Сервіс для доступу до змінних оточення (env)
import * as crypto from 'crypto' // Модуль Node.js для роботи з криптографією

/**
 * Перевіряє достовірність даних, отриманих від Telegram (перевірка підпису).
 * Алгоритм описаний у документації Telegram: https://core.telegram.org/widgets/login#checking-authorization
 *
 * @param query - Об'єкт з даними користувача Telegram (у т.ч. hash)
 * @returns true, якщо підпис валідний, інакше false
 * @throws Error, якщо не задано TELEGRAM_BOT_TOKEN у змінних оточення
 */
export function validateTelegramAuth(query: ITelegramProfile): boolean {
	const configService = new ConfigService() // Створюємо екземпляр сервісу конфігурації
	const token = configService.get<string>('TELEGRAM_BOT_TOKEN') // Отримуємо токен бота з env

	if (!token) {
		throw new Error('TELEGRAM_BOT_TOKEN is not defined') // Якщо токен не заданий — помилка
	}

	const { hash, ...data } = query // Відокремлюємо hash від решти даних

	// Формуємо data_check_string: ключі сортуються, пари key=value з'єднуються через \n
	const dataCheckString = Object.keys(data)
		.sort()
		.map(key => `${key}=${data[key]}`)
		.join('\n')

	// Створюємо секретний ключ: sha256 від токена бота
	const secretKey = crypto.createHash('sha256').update(token).digest()

	// Обчислюємо hash для перевірки: HMAC-SHA256(data_check_string, secretKey)
	const checkHash = crypto
		.createHmac('sha256', secretKey)
		.update(dataCheckString)
		.digest('hex')

	// Порівнюємо обчислений hash з тим, що прийшов у запиті
	return checkHash === hash
}

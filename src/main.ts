import { RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

/**
 * Головна функція для запуску NestJS додатку.
 * Тут налаштовуються глобальні параметри, CORS, cookie, префікси маршрутів тощо.
 */
async function bootstrap() {
	const app = await NestFactory.create(AppModule) // Створюємо інстанс додатку з головним модулем

	// Встановлюємо глобальний префікс для всіх маршрутів (наприклад, /api),
	// але виключаємо певні маршрути (OAuth редіректи, verify-email), які мають бути доступні без префіксу
	app.setGlobalPrefix('api', {
		exclude: [
			{ path: 'auth/google', method: RequestMethod.GET }, // OAuth Google (ініціалізація)
			{ path: 'auth/google/redirect', method: RequestMethod.GET }, // OAuth Google (редірект)
			{ path: 'auth/github', method: RequestMethod.GET }, // OAuth GitHub (ініціалізація)
			{ path: 'auth/github/redirect', method: RequestMethod.GET }, // OAuth GitHub (редірект)
			{ path: 'auth/telegram/redirect', method: RequestMethod.GET }, // OAuth Telegram (редірект)
			{ path: 'verify-email', method: RequestMethod.GET }, // Верифікація email (GET)
		],
	})

	app.use(cookieParser()) // Додаємо middleware для парсингу cookie (для роботи з refresh токенами)

	app.enableCors({
		origin: ['http://localhost:3000'], // Дозволяємо запити тільки з цього origin (frontend)
		credentials: true, // Дозволяємо надсилати куки та заголовки авторизації
		exposedHeaders: 'set-cookie', // Додаємо можливість читати заголовок set-cookie на клієнті
	})

	await app.listen(4000) // Запускаємо сервер на порту 4000
}

bootstrap() // Викликаємо функцію запуску додатку

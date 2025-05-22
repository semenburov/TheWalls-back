import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * Сервіс для роботи з базою даних через Prisma.
 * Наслідує PrismaClient та автоматично підключається до БД при ініціалізації модуля.
 */
@Injectable() // Декоратор для реєстрації сервісу у DI контейнері NestJS
export class PrismaService extends PrismaClient implements OnModuleInit {
	/**
	 * Хук, який викликається при ініціалізації модуля NestJS.
	 * Підключає клієнт Prisma до бази даних.
	 */
	async onModuleInit() {
		await this.$connect() // Встановлюємо з'єднання з базою даних
	}
}

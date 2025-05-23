import {
	Injectable,
	OnModuleInit,
	INestApplication,
	Logger,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * Сервіс для роботи з базою даних через Prisma.
 * Наслідує PrismaClient та автоматично підключається до БД при ініціалізації модуля.
 */
@Injectable() // Декоратор для реєстрації сервісу у DI контейнері NestJS
export class PrismaService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger(PrismaService.name) // Логгер для виводу повідомлень
	/**
	 * Хук, який викликається при ініціалізації модуля NestJS.
	 * Підключає клієнт Prisma до бази даних.
	 */
	async onModuleInit() {
		await this.$connect() // Встановлюємо з'єднання з базою даних
		this.logger.log('Connected to Prisma DB')
	}

	/**
	 * Хук, який викликається перед закриттям програми.
	 * Закриває з'єднання з базою даних.
	 * @param app - Інстанс NestApplication
	 */
	async enableShutdownHooks(app: INestApplication) {
		process.on('beforeExit', async () => {
			this.logger.log('Disconnecting Prisma')
			await app.close()
		})
	}
}

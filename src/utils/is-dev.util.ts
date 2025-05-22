import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

// Завантажуємо змінні оточення з .env файлу у process.env
dotenv.config()

/**
 * Перевіряє, чи поточне середовище є development (через ConfigService).
 * @param configService - Інжектований сервіс конфігурації NestJS
 * @returns true, якщо NODE_ENV === 'development'
 */
export const isDev = (configService: ConfigService) =>
	configService.get('NODE_ENV') === 'development'

/**
 * Глобальна константа для визначення, чи середовище development (через process.env).
 * Може використовуватись у файлах, де немає доступу до DI.
 */
export const IS_DEV_ENV = process.env.NODE_ENV === 'development'

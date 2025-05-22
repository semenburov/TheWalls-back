import { Module } from '@nestjs/common' // Декоратор для оголошення модуля
import { ConfigModule, ConfigService } from '@nestjs/config' // Модуль та сервіс для роботи з конфігурацією (env)
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha' // Модуль для інтеграції Google reCAPTCHA
import { AuthModule } from './auth/auth.module' // Модуль авторизації (логін, реєстрація, соцмережі)
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config' // Фабрика для асинхронної конфігурації reCAPTCHA
import { UserModule } from './user/user.module' // Модуль користувачів (логіка, контролер, сервіси)

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true, // Робимо модуль конфігурації глобальним (доступний у всіх модулях без повторного імпорту)
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule], // Додаємо модуль конфігурації для доступу до змінних оточення
			useFactory: getGoogleRecaptchaConfig, // Фабрика для асинхронної конфігурації Google reCAPTCHA (ключ, debug, skipIf)
			inject: [ConfigService], // Інжектимо сервіс конфігурації у фабрику
		}),
		AuthModule, // Модуль авторизації (логін, реєстрація, токени, соцмережі)
		UserModule, // Модуль користувачів (профіль, список, оновлення email)
	],
	// Можна додати controllers і providers, якщо потрібно
})
export class AppModule {} // Головний модуль додатку, який об'єднує всі функціональні частини

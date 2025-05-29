import { Module } from '@nestjs/common' // Декоратор для оголошення модуля
import { ConfigModule, ConfigService } from '@nestjs/config' // Модуль та сервіс для роботи з конфігурацією (env)
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha' // Модуль для інтеграції Google reCAPTCHA
import { AuthModule } from './auth/auth.module' // Модуль авторизації (логін, реєстрація, соцмережі)
import { getGoogleRecaptchaConfig } from './config/google-recaptcha.config' // Фабрика для асинхронної конфігурації reCAPTCHA
import { UserModule } from './modules/user/user.module' // Модуль користувачів (логіка, контролер, сервіси)
import { SocietyModule } from './modules/society/society.module' // Модуль для роботи з суспільством (логіка, контролер, сервіси)
import { HausModule } from './modules/haus/haus.module' // Модуль для роботи з об'єктами (логіка, контролер, сервіси)
import { MeterModule } from './modules/meter/meter.module' // Модуль для роботи з лічильниками (логіка, контролер, сервіси)
import { TariffModule } from './modules/tariff/tariff.module' // Модуль для роботи з тарифами (логіка, контролер, сервіси)
import { UserModule as InviteUserModule } from './modules/user/user.module' // Модуль для роботи з користувачами (логіка, контролер, сервіси)
import { MeterReportModule } from './modules/meterReport/meterReport.module' // Модуль для роботи з звітами по лічильникам (логіка, контролер, сервіси)
import { AnalyticsModule } from './modules/analytics/analytics.module' // Модуль для роботи з аналітикою (логіка, контролер, сервіси)

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
		SocietyModule, // Модуль суспільства (логіка, контролер, сервіси)
		HausModule, // Модуль для роботи з об'єктами (логіка, контролер, сервіси)
		MeterModule, // Модуль для роботи з лічильниками (логіка, контролер, сервіси)
		TariffModule, // Модуль для роботи з тарифами (логіка, контролер, сервіси)
		InviteUserModule, // Модуль для роботи з запрошеннями користувачів (логіка, контролер, сервіси)
		AnalyticsModule, // Модуль для роботи з аналітикою (логіка, контролер, сервіси)
	],
	// Можна додати controllers і providers, якщо потрібно
})
export class AppModule {} // Головний модуль додатку, який об'єднує всі функціональні частини

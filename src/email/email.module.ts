import { MailerModule } from '@nestjs-modules/mailer' // Модуль для роботи з email через SMTP
import { Module } from '@nestjs/common' // Декоратор для оголошення модуля
import { ConfigModule, ConfigService } from '@nestjs/config' // Модуль та сервіс для роботи з конфігурацією (env)
import { getMailerConfig } from 'src/config/mailer.config' // Фабрика для асинхронної конфігурації поштового модуля
import { EmailService } from './email.service' // Сервіс для відправки email

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule], // Додаємо модуль конфігурації для доступу до змінних оточення
			useFactory: getMailerConfig, // Фабрика для асинхронної конфігурації SMTP (host, port, auth тощо)
			inject: [ConfigService], // Інжектимо сервіс конфігурації у фабрику
		}),
	],
	providers: [EmailService], // Реєструємо EmailService у DI контейнері
	exports: [EmailService], // Експортуємо EmailService для використання в інших модулях
})
export class EmailModule {} // Модуль для роботи з email (відправка листів, шаблони тощо)

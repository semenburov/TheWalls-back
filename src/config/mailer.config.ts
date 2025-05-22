import { isDev } from '@/utils/is-dev.util' // Утиліта для визначення, чи середовище розробки
import { MailerOptions } from '@nestjs-modules/mailer' // Тип для опцій модуля пошти
import { ConfigService } from '@nestjs/config' // Сервіс для доступу до змінних оточення (env)

/**
 * Асинхронна фабрика для конфігурації модуля пошти (MailerModule).
 * Використовується для підключення SMTP-сервера у різних середовищах.
 *
 * @param configService - Сервіс для доступу до змінних оточення (env)
 * @returns Promise з об'єктом налаштувань MailerOptions
 */
export const getMailerConfig = async (
	configService: ConfigService // Інжектований сервіс конфігурації
): Promise<MailerOptions> => ({
	transport: {
		host: configService.get('SMTP_SERVER'), // Адреса SMTP-сервера (з env)
		port: isDev(configService) ? 587 : 465, // Порт: 587 для dev (STARTTLS), 465 для prod (SSL)
		secure: !isDev(configService), // secure=true для prod (SSL), false для dev (STARTTLS)
		auth: {
			user: configService.get('SMTP_LOGIN'), // SMTP логін (з env)
			pass: configService.get('SMTP_PASSWORD'), // SMTP пароль (з env)
		},
	},
	defaults: {
		from: '"htmllessons" <no-reply@htmllessons.ru>', // Відправник за замовчуванням для всіх листів
	},
})

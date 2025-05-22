import { ConfigService } from '@nestjs/config' // Сервіс для доступу до змінних оточення (env)
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha/interfaces/google-recaptcha-module-options' // Тип для опцій модуля Google reCAPTCHA
import { isDev } from '../utils/is-dev.util' // Утиліта для визначення, чи середовище розробки

/**
 * Асинхронна фабрика для конфігурації Google reCAPTCHA модуля.
 * Використовується для підключення захисту від ботів у різних середовищах.
 *
 * @param configService - Сервіс для доступу до змінних оточення (env)
 * @returns Promise з об'єктом налаштувань GoogleRecaptchaModuleOptions
 */
export const getGoogleRecaptchaConfig = async (
	configService: ConfigService // Інжектований сервіс конфігурації
): Promise<GoogleRecaptchaModuleOptions> => ({
	secretKey: configService.get<string>('RECAPTCHA_SECRET_KEY'), // Секретний ключ для перевірки reCAPTCHA (з env)
	response: req => req.headers.recaptcha, // Функція для отримання відповіді reCAPTCHA з заголовка запиту
	skipIf: isDev(configService), // Якщо середовище dev — пропускаємо перевірку reCAPTCHA
	debug: isDev(configService), // Якщо dev — вмикаємо debug-режим для reCAPTCHA
})

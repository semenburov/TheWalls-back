import { AuthService } from '@/auth/auth.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy as AppleStrategy } from 'passport-apple'
import {
	IAppleProfile,
	TSocialCallback,
} from '../social-media/social-media-auth.types'

@Injectable() // Декоратор для можливості інжекції через DI контейнер NestJS
export class AppleAuthStrategy extends PassportStrategy(
	AppleStrategy, // Використовуємо стратегію Apple з пакету passport-apple
	'apple' // Назва стратегії (ідентифікатор для AuthGuard)
) {
	constructor(
		private configService: ConfigService, // Сервіс для доступу до змінних конфігурації (env)
		private authService: AuthService // Сервіс авторизації (може використовуватись для додаткової логіки)
	) {
		// Викликаємо конструктор базового класу PassportStrategy з налаштуваннями Apple OAuth
		super({
			clientID: configService.get('APPLE_CLIENT_ID'), // Ідентифікатор додатку Apple
			teamID: configService.get('APPLE_TEAM_ID'), // Team ID Apple Developer
			keyID: configService.get('APPLE_KEY_ID'), // Key ID для підпису JWT
			callbackURL: configService.get('APPLE_CALLBACK_URL'), // URL для редіректу після авторизації
			privateKeyString: configService.get('APPLE_PRIVATE_KEY'), // Приватний ключ для підпису
			scope: ['name', 'email'], // Запитувані поля профілю користувача
		})
	}

	/**
	 * Метод валідації, який викликається після успішної авторизації Apple.
	 * Тут формується об'єкт користувача для подальшої обробки у системі.
	 *
	 * @param accessToken - Access token, виданий Apple
	 * @param refreshToken - Refresh token, виданий Apple
	 * @param profile - Профіль користувача (IAppleProfile)
	 * @param done - Callback, який повертає результат (user або помилку)
	 */
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: IAppleProfile,
		done: TSocialCallback
	) {
		// Формуємо об'єкт користувача для подальшої обробки (login/реєстрація)
		done(null, {
			email: profile.email, // Email користувача Apple
			name: profile.firstName + ' ' + profile.lastName, // Ім'я та прізвище користувача
		})
	}
}

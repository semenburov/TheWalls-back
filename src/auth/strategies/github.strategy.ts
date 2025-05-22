import { AuthService } from '@/auth/auth.service'
import {
	IGithubProfile, // Тип профілю користувача, який повертає GitHub OAuth
	TSocialCallback, // Тип callback-функції для завершення авторизації
} from '@/auth/social-media/social-media-auth.types'
import { Injectable } from '@nestjs/common' // Декоратор для DI
import { ConfigService } from '@nestjs/config' // Сервіс для доступу до змінних оточення
import { PassportStrategy } from '@nestjs/passport' // Базовий клас для створення стратегій Passport
import { Strategy } from 'passport-github2' // Стратегія GitHub OAuth2 для Passport

@Injectable() // Декоратор, що дозволяє інжекцію цього класу через DI контейнер NestJS
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
	constructor(
		private configService: ConfigService, // Сервіс для доступу до конфігурації (env)
		private authService: AuthService // Сервіс авторизації (може використовуватись для додаткової логіки)
	) {
		// Викликаємо конструктор базового класу PassportStrategy з налаштуваннями GitHub OAuth
		super({
			clientID: configService.get('GITHUB_CLIENT_ID'), // Ідентифікатор додатку GitHub
			clientSecret: configService.get('GITHUB_CLIENT_SECRET'), // Секрет додатку GitHub
			callbackURL: configService.get('GITHUB_CALLBACK_URL'), // URL для редіректу після авторизації
			scope: ['user:email'], // Запитувані права доступу (email користувача)
		})
	}

	/**
	 * Метод валідації, який викликається після успішної авторизації GitHub.
	 * Тут формується об'єкт користувача для подальшої обробки у системі.
	 *
	 * @param accessToken - Access token, виданий GitHub
	 * @param refreshToken - Refresh token, виданий GitHub (може бути не використаний)
	 * @param profile - Профіль користувача (IGithubProfile)
	 * @param done - Callback, який повертає результат (user або помилку)
	 */
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: IGithubProfile,
		done: TSocialCallback
	) {
		// Формуємо об'єкт користувача для подальшої обробки (login/реєстрація)
		done(null, {
			avatarPath: profile.profileUrl, // URL профілю GitHub як аватарка
			email: profile.emails[0].value, // Основний email користувача
			name: profile.displayName, // Відображуване ім'я користувача
		})
	}
}

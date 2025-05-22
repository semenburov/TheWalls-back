import { AuthService } from '@/auth/auth.service'
import {
	IGoogleProfile, // Тип профілю користувача, який повертає Google OAuth
	TSocialCallback, // Тип callback-функції для завершення авторизації
} from '@/auth/social-media/social-media-auth.types'
import { Injectable } from '@nestjs/common' // Декоратор для DI
import { ConfigService } from '@nestjs/config' // Сервіс для доступу до змінних оточення
import { PassportStrategy } from '@nestjs/passport' // Базовий клас для створення стратегій Passport
import { Strategy } from 'passport-google-oauth20' // Стратегія Google OAuth2 для Passport

@Injectable() // Декоратор, що дозволяє інжекцію цього класу через DI контейнер NestJS
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private configService: ConfigService, // Сервіс для доступу до конфігурації (env)
		private authService: AuthService // Сервіс авторизації (може використовуватись для додаткової логіки)
	) {
		// Викликаємо конструктор базового класу PassportStrategy з налаштуваннями Google OAuth
		super({
			clientID: configService.get('GOOGLE_CLIENT_ID'), // Ідентифікатор додатку Google
			clientSecret: configService.get('GOOGLE_CLIENT_SECRET'), // Секрет додатку Google
			callbackURL: configService.get('GOOGLE_CALLBACK_URL'), // URL для редіректу після авторизації
			scope: ['email', 'profile'], // Запитувані права доступу (email та профіль користувача)
		})
	}

	/**
	 * Метод валідації, який викликається після успішної авторизації Google.
	 * Тут формується об'єкт користувача для подальшої обробки у системі.
	 *
	 * @param accessToken - Access token, виданий Google
	 * @param refreshToken - Refresh token, виданий Google (може бути не використаний)
	 * @param profile - Профіль користувача (IGoogleProfile)
	 * @param done - Callback, який повертає результат (user або помилку)
	 */
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: IGoogleProfile,
		done: TSocialCallback
	): Promise<any> {
		// Формуємо об'єкт користувача для подальшої обробки (login/реєстрація)
		done(null, {
			avatarPath: profile.photos[0].value, // URL аватарки користувача з Google
			email: profile.emails[0].value, // Основний email користувача
			name: profile.displayName, // Відображуване ім'я користувача
		})
	}
}

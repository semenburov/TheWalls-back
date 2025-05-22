import { AuthService } from '@/auth/auth.service'
import { RefreshTokenService } from '@/auth/refresh-token.service'
import { SocialMediaAuthService } from '@/auth/social-media/social-media-auth.service'

import { validateTelegramAuth } from '@/utils/validate-telegram-auth.util'
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'
import { ITelegramProfile, TUserSocial } from './social-media-auth.types'

@Controller('auth') // Префікс для всіх маршрутів цього контролера: /auth
export class SocialMediaAuthController {
	constructor(
		private readonly socialMediaAuthService: SocialMediaAuthService, // Сервіс для логіки авторизації через соцмережі
		private readonly authService: AuthService, // Сервіс для роботи з JWT, access/refresh токенами
		private readonly refreshTokenService: RefreshTokenService // Сервіс для роботи з refresh токенами (запис у куки)
	) {}

	private _CLIENT_BASE_URL = 'http://localhost:3000/social-auth?accessToken=' // Базова URL-адреса клієнта для редіректу після авторизації

	// ----------- Google авторизація -----------
	@Get('google') // GET /auth/google
	@UseGuards(AuthGuard('google')) // Використовуємо Guard для Google OAuth (ініціалізує редірект на Google)
	async googleAuth() {} // Тіло не потрібне, Guard все обробляє самостійно

	@Get('google/redirect') // GET /auth/google/redirect
	@UseGuards(AuthGuard('google')) // Guard обробляє редірект від Google після авторизації
	async googleAuthRedirect(
		@Req() req: { user: TUserSocial }, // Об'єкт request з користувачем, якого повертає стратегія Google
		@Res({ passthrough: true }) res: Response // Response з можливістю змінювати куки, але не завершувати відповідь
	) {
		const user = await this.socialMediaAuthService.login(req) // Логін/реєстрація користувача через соцмережу (Google)
		const { accessToken, refreshToken } =
			await this.authService.buildResponseObject(user) // Генеруємо JWT access та refresh токени
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken) // Додаємо refresh токен у httpOnly cookie
		return res.redirect(`${this._CLIENT_BASE_URL}${accessToken}`) // Редіректимо на клієнт з accessToken у URL
	}

	// ----------- GitHub авторизація -----------
	@Get('github') // GET /auth/github
	@UseGuards(AuthGuard('github')) // Guard для GitHub OAuth (ініціалізує редірект на GitHub)
	async githubAuth() {} // Тіло не потрібне, Guard все обробляє самостійно

	@Get('github/redirect') // GET /auth/github/redirect
	@UseGuards(AuthGuard('github')) // Guard обробляє редірект від GitHub після авторизації
	async githubAuthRedirect(
		@Req() req: { user: TUserSocial }, // Об'єкт request з користувачем, якого повертає стратегія GitHub
		@Res({ passthrough: true }) res: Response // Response для роботи з куками
	) {
		const user = await this.socialMediaAuthService.login(req) // Логін/реєстрація користувача через соцмережу (GitHub)
		const { accessToken, refreshToken } =
			await this.authService.buildResponseObject(user) // Генеруємо JWT access та refresh токени
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken) // Додаємо refresh токен у httpOnly cookie
		return res.redirect(`${this._CLIENT_BASE_URL}${accessToken}`) // Редіректимо на клієнт з accessToken у URL
	}

	// ----------- Apple авторизація -----------
	@Get('apple') // GET /auth/apple
	@UseGuards(AuthGuard('apple')) // Guard для Apple OAuth (ініціалізує редірект на Apple)
	async appleAuth() {} // Тіло не потрібне, Guard все обробляє самостійно

	@Get('apple/redirect') // GET /auth/apple/redirect
	@UseGuards(AuthGuard('apple')) // Guard обробляє редірект від Apple після авторизації
	async appleAuthRedirect(
		@Req() req: { user: TUserSocial }, // Об'єкт request з користувачем, якого повертає стратегія Apple
		@Res({ passthrough: true }) res: Response // Response для роботи з куками
	) {
		const user = await this.socialMediaAuthService.login(req) // Логін/реєстрація користувача через соцмережу (Apple)
		const { accessToken, refreshToken } =
			await this.authService.buildResponseObject(user) // Генеруємо JWT access та refresh токени
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken) // Додаємо refresh токен у httpOnly cookie
		return res.redirect(`${this._CLIENT_BASE_URL}${accessToken}`) // Редіректимо на клієнт з accessToken у URL
	}

	// ----------- Telegram авторизація -----------
	@Get('telegram/redirect') // GET /auth/telegram/redirect
	async telegramAuthRedirect(
		@Query() query: ITelegramProfile, // Дані користувача з Telegram приходять у query-параметрах
		@Res({ passthrough: true }) res: Response // Response для роботи з куками
	) {
		// Проверяем подпись (hash), чтобы убедиться, что данные пришли от Telegram
		if (!validateTelegramAuth(query)) {
			throw new Error('Invalid Telegram authentication data') // Якщо підпис невалідний — помилка
		}

		// Логін/реєстрація користувача через Telegram
		const user = await this.socialMediaAuthService.login({
			user: {
				telegramId: query.telegramId, // Унікальний ідентифікатор Telegram
				name: query.username || `${query.firstName} ${query.lastName}`, // Ім'я користувача (username або ім'я+прізвище)
				avatarPath: query.photoUrl || '', // Фото профілю, якщо є
			},
		})

		const { accessToken, refreshToken } =
			await this.authService.buildResponseObject(user) // Генеруємо JWT access та refresh токени
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken) // Додаємо refresh токен у httpOnly cookie

		// Якщо у користувача немає email — додаємо параметр needEmail для фронту
		const redirectUrl = `${this._CLIENT_BASE_URL}${accessToken}${
			!user.email ? '&needEmail=true' : ''
		}`

		return res.redirect(redirectUrl) // Редіректимо на клієнт з accessToken та, за потреби, прапорцем needEmail
	}
}

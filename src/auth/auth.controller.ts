import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Query,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha' // Декоратор для захисту від ботів (Google reCAPTCHA)
import { Request, Response } from 'express' // Типи для роботи з HTTP-запитами/відповідями
import { AuthService } from './auth.service' // Сервіс для бізнес-логіки авторизації
import { AuthDto } from './dto/auth.dto' // DTO для логіну/реєстрації
import { RefreshTokenService } from './refresh-token.service' // Сервіс для роботи з refresh токенами

@Controller() // Контролер без префіксу (шлях задається у кожному методі)
export class AuthController {
	constructor(
		private readonly authService: AuthService, // Інжекція сервісу авторизації
		private readonly refreshTokenService: RefreshTokenService // Інжекція сервісу для роботи з refresh токенами
	) {}

	@UsePipes(new ValidationPipe()) // Валідація вхідних даних через DTO
	@HttpCode(200) // Встановлюємо HTTP статус 200 для відповіді
	@Recaptcha() // Захист від ботів (Google reCAPTCHA)
	@Post('auth/login') // POST /auth/login
	async login(
		@Body() dto: AuthDto, // DTO з email та паролем
		@Res({ passthrough: true }) res: Response // Response для роботи з куками (passthrough дозволяє не завершувати відповідь вручну)
	) {
		const { refreshToken, ...response } = await this.authService.login(dto) // Логін користувача, отримуємо токени

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken) // Додаємо refresh токен у httpOnly cookie

		return response // Повертаємо відповідь без refresh токена (наприклад, accessToken, user)
	}

	@UsePipes(new ValidationPipe()) // Валідація вхідних даних через DTO
	@HttpCode(200)
	@Recaptcha()
	@Post('auth/register') // POST /auth/register
	async register(
		@Body() dto: AuthDto, // DTO з email та паролем
		@Res({ passthrough: true }) res: Response // Response для роботи з куками
	) {
		const { refreshToken, ...response } = await this.authService.register(dto) // Реєстрація користувача, отримуємо токени
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken) // Додаємо refresh токен у httpOnly cookie
		return response // Повертаємо відповідь без refresh токена
	}

	@HttpCode(200)
	@Get('verify-email') // GET /verify-email?token=...
	async verifyEmail(@Query('token') token?: string) {
		if (!token) {
			throw new UnauthorizedException('Token not passed') // Якщо токен не передано — помилка
		}

		return this.authService.verifyEmail(token) // Верифікація email за токеном
	}

	@HttpCode(200)
	@Post('auth/access-token') // POST /auth/access-token
	async getNewTokens(
		@Req() req: Request, // Запит, з якого беремо куки
		@Res({ passthrough: true }) res: Response // Response для оновлення куки
	) {
		const refreshTokenFromCookies =
			req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME] // Витягуємо refresh токен з куки

		if (!refreshTokenFromCookies) {
			this.refreshTokenService.removeRefreshTokenFromResponse(res) // Видаляємо refresh токен з куки, якщо його немає
			throw new UnauthorizedException('Refresh token not passed') // Кидаємо помилку
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies // Оновлюємо токени за refresh токеном
		)

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken) // Додаємо новий refresh токен у куки

		return response // Повертаємо новий accessToken та інші дані (без refresh токена)
	}

	@HttpCode(200)
	@Post('auth/logout') // POST /auth/logout
	async logout(@Res({ passthrough: true }) res: Response) {
		this.refreshTokenService.removeRefreshTokenFromResponse(res) // Видаляємо refresh токен з куки

		return true // Повертаємо успішну відповідь
	}
}

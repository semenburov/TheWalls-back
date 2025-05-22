import { Injectable } from '@nestjs/common'
import type { Response } from 'express' // Тип для HTTP-відповіді Express

@Injectable() // Декоратор, що дозволяє інжекцію цього сервісу через DI контейнер NestJS
export class RefreshTokenService {
	readonly EXPIRE_DAY_REFRESH_TOKEN = 1 // Кількість днів, на які видається refresh токен (1 день)
	readonly REFRESH_TOKEN_NAME = 'refreshToken' // Назва куки для refresh токена

	/**
	 * Додає refresh токен у httpOnly cookie до відповіді.
	 * @param res - HTTP-відповідь Express
	 * @param refreshToken - Значення refresh токена
	 */
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN) // Встановлюємо дату закінчення дії куки

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true, // Кука недоступна з JS (тільки для сервера)
			domain: 'localhost', // Домен, для якого встановлюється кука
			expires: expiresIn, // Дата закінчення дії куки
			secure: true, // Передавати тільки по HTTPS (true для production)
			sameSite: 'none', // Політика SameSite (none для крос-домену, lax для production)
		})
	}

	/**
	 * Видаляє refresh токен з httpOnly cookie у відповіді.
	 * @param res - HTTP-відповідь Express
	 */
	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true, // Кука недоступна з JS
			domain: 'localhost', // Домен куки
			expires: new Date(0), // Встановлюємо дату в минулому, щоб видалити куку
			secure: true, // Тільки по HTTPS
			sameSite: 'none', // Політика SameSite
		})
	}
}

import { VERIFY_EMAIL_URL } from '@/constants'
import { EmailService } from '@/email/email.service'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'
import { HttpService } from '@nestjs/axios'
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Role, type User } from '@prisma/client'
import { verify } from 'argon2'
import { omit } from 'lodash'
import { lastValueFrom } from 'rxjs'
import { AuthDto } from './dto/auth.dto'

@Injectable() // Декоратор, що дозволяє інжекцію цього сервісу через DI контейнер NestJS
export class AuthService {
	constructor(
		private jwt: JwtService, // Сервіс для роботи з JWT токенами (генерація, перевірка)
		private userService: UserService, // Сервіс для роботи з користувачами (БД)
		private emailService: EmailService, // Сервіс для відправки email (верифікація, повідомлення)
		private prisma: PrismaService, // Сервіс для прямої роботи з БД через Prisma
		private readonly httpService: HttpService
	) {}

	private readonly TOKEN_EXPIRATION_ACCESS = '1h' // Термін дії access токена (1 година)
	private readonly TOKEN_EXPIRATION_REFRESH = '7d' // Термін дії refresh токена (7 днів)

	/**
	 * Логін користувача: перевіряє дані та повертає токени й користувача.
	 * @param dto - DTO з email та паролем
	 * @returns Об'єкт з access/refresh токенами та користувачем
	 */
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto) // Перевіряємо email і пароль
		return this.buildResponseObject(user) // Повертаємо токени та користувача
	}

	async verifyRecaptcha(token: string) {
		const secret = process.env.RECAPTCHA_SECRET_KEY
		const url = 'https://www.google.com/recaptcha/api/siteverify'
		const params = new URLSearchParams({ secret, response: token })

		const response$ = this.httpService.post(url, params)
		const { data } = await lastValueFrom(response$)

		if (!data.success) {
			throw new BadRequestException('Recaptcha validation failed')
		}
	}

	/**
	 * Реєстрація нового користувача.
	 * @param dto - DTO з email та паролем
	 * @returns Об'єкт з токенами та користувачем
	 * @throws BadRequestException, якщо користувач вже існує
	 */
	async register(dto: AuthDto) {
		await this.verifyRecaptcha(dto.recaptchaToken) // Перевіряємо reCAPTCHA
		const userExists = await this.userService.getByEmail(dto.email) // Перевіряємо, чи існує користувач
		if (userExists) {
			throw new BadRequestException('User already exists') // Якщо так — помилка
		}
		const user = await this.userService.create(dto) // Створюємо нового користувача

		// Відправляємо email для підтвердження пошти
		await this.emailService.sendVerification(
			user.email,
			`${VERIFY_EMAIL_URL}${user.verificationToken}`
		)

		return this.buildResponseObject(user) // Повертаємо токени та користувача
	}

	/**
	 * Оновлення access/refresh токенів за refresh токеном.
	 * @param refreshToken - Refresh токен з куки
	 * @returns Нові токени та користувач
	 * @throws UnauthorizedException, якщо токен невалідний
	 */
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken) // Перевіряємо refresh токен
		if (!result) {
			throw new UnauthorizedException('Invalid refresh token')
		}
		const user = await this.userService.getById(result.id) // Знаходимо користувача по id з токена
		return this.buildResponseObject(user) // Повертаємо нові токени та користувача
	}

	/**
	 * Верифікація email користувача за токеном.
	 * @param token - Токен з email-посилання
	 * @returns Повідомлення про успішну верифікацію
	 * @throws NotFoundException, якщо токен не знайдено
	 */
	async verifyEmail(token: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				verificationToken: token,
			},
		})

		if (!user) throw new NotFoundException('Token not exists!')

		// Очищаємо токен після верифікації
		await this.userService.update(user.id, {
			verificationToken: null,
		})

		return 'Email verified!'
	}

	/**
	 * Формує відповідь для клієнта: токени та користувач без пароля.
	 * @param user - Об'єкт користувача
	 * @returns Об'єкт з user, accessToken, refreshToken
	 */
	async buildResponseObject(user: User) {
		const tokens = await this.issueTokens(user.id, user.rights || []) // Генеруємо токени
		return { user: this.omitPassword(user), ...tokens } // Повертаємо користувача без пароля та токени
	}

	/**
	 * Генерує access та refresh токени для користувача.
	 * @param userId - ID користувача
	 * @param rights - Масив ролей користувача
	 * @returns Об'єкт з accessToken та refreshToken
	 */
	private async issueTokens(userId: string, rights: Role[]) {
		const payload = { id: userId, rights } // Дані, які будуть у токені
		const accessToken = this.jwt.sign(payload, {
			expiresIn: this.TOKEN_EXPIRATION_ACCESS,
		})
		const refreshToken = this.jwt.sign(payload, {
			expiresIn: this.TOKEN_EXPIRATION_REFRESH,
		})
		return { accessToken, refreshToken }
	}

	/**
	 * Перевіряє email і пароль користувача.
	 * @param dto - DTO з email та паролем
	 * @returns Об'єкт користувача, якщо дані валідні
	 * @throws UnauthorizedException, якщо дані невалідні
	 */
	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email) // Шукаємо користувача по email
		if (!user) {
			throw new UnauthorizedException('Email or password invalid')
		}
		const isValid = await verify(user.password, dto.password) // Перевіряємо пароль (argon2)
		if (!isValid) {
			throw new UnauthorizedException('Email or password invalid')
		}
		return user
	}

	/**
	 * Видаляє поле password з об'єкта користувача перед поверненням клієнту.
	 * @param user - Об'єкт користувача
	 * @returns Копія користувача без пароля
	 */
	private omitPassword(user: User) {
		return omit(user, ['password'])
	}
}

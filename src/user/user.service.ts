import { AuthDto } from '@/auth/dto/auth.dto'
import { TUserSocial } from '@/auth/social-media/social-media-auth.types'
import { VERIFY_EMAIL_URL } from '@/constants'
import { EmailService } from '@/email/email.service'
import { Injectable } from '@nestjs/common'
import type { User } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'

@Injectable() // Декоратор, що дозволяє інжекцію цього сервісу через DI контейнер NestJS
export class UserService {
	constructor(
		private prisma: PrismaService, // Сервіс для роботи з базою даних через Prisma
		private emailService: EmailService // Сервіс для відправки email (верифікація, повідомлення)
	) {}

	/**
	 * Повертає список усіх користувачів (без паролів).
	 * @returns Масив користувачів з полями name, email, id
	 */
	async getUsers() {
		return this.prisma.user.findMany({
			select: {
				name: true, // Ім'я користувача
				email: true, // Email користувача
				id: true, // ID користувача
				password: false, // Не включати пароль у відповідь
			},
		})
	}

	/**
	 * Повертає користувача за його id.
	 * @param id - ID користувача
	 * @returns Об'єкт користувача або null, якщо не знайдено
	 */
	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id, // Пошук по id
			},
		})
	}

	/**
	 * Повертає користувача за email.
	 * @param email - Email користувача
	 * @returns Об'єкт користувача або null, якщо не знайдено
	 */
	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email, // Пошук по email
			},
		})
	}

	/**
	 * Знаходить або створює користувача за профілем із соцмережі.
	 * @param profile - Дані користувача з соцмережі (TUserSocial)
	 * @returns Об'єкт користувача з БД
	 */
	async findOrCreateSocialUser(profile: TUserSocial) {
		const email = profile.email // Email з профілю соцмережі
		let user: User | null = null

		if (email) {
			user = await this.getByEmail(email) // Якщо є email — шукаємо користувача
		}

		if (!user) {
			user = await this._createSocialUser(profile) // Якщо не знайдено — створюємо нового користувача
		}

		return user
	}

	/**
	 * Приватний метод для створення користувача з профілю соцмережі.
	 * @param profile - Дані користувача з соцмережі
	 * @returns Новий об'єкт користувача
	 */
	private async _createSocialUser(profile: TUserSocial): Promise<User> {
		const verificationToken = profile.email
			? {
					verificationToken: null, // Якщо є email — не потрібен токен для верифікації
				}
			: {}

		return this.prisma.user.create({
			data: {
				email: profile.email || '', // Email або порожній рядок
				name: profile.name || '', // Ім'я або порожній рядок
				password: '', // Пароль порожній (логін через соцмережу)
				...verificationToken, // Додаємо verificationToken, якщо потрібно
				avatarPath: profile.avatarPath || null, // Аватарка або null
			},
		})
	}

	/**
	 * Створює нового користувача за DTO (логін/реєстрація через email).
	 * @param dto - DTO з email та паролем
	 * @returns Новий об'єкт користувача
	 */
	async create(dto: AuthDto) {
		return this.prisma.user.create({
			data: {
				...dto, // Всі поля з DTO (email, name, тощо)
				password: await hash(dto.password), // Хешуємо пароль перед збереженням
			},
		})
	}

	/**
	 * Оновлює дані користувача за id.
	 * @param id - ID користувача
	 * @param data - Дані для оновлення (частковий User)
	 * @returns Оновлений об'єкт користувача
	 */
	async update(id: string, data: Partial<User>) {
		const user = await this.prisma.user.update({
			where: {
				id, // Пошук по id
			},
			data, // Дані для оновлення
		})

		// Відправляємо лист для підтвердження email, якщо змінився email або токен
		await this.emailService.sendVerification(
			user.email,
			`${VERIFY_EMAIL_URL}${user.verificationToken}`
		)

		return user
	}
}

// src/modules/user/user.service.ts

import { AuthDto } from '@/auth/dto/auth.dto'
import { VERIFY_EMAIL_URL } from '@/constants'
import { EmailService } from '@/email/email.service'
import { PrismaService } from '@/prisma/prisma.service'
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import type { User } from '@prisma/client'
import { hash } from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import { InviteUserDto } from './dto/invite-user.dto'

import { TUserSocial } from '@/auth/social-media/social-media-auth.types'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		private emailService: EmailService // Сервіс для відправки email (верифікація, повідомлення)
	) {}

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

	async getProfile(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				UserSociety: {
					include: {
						society: true,
					},
				},
			},
		})

		if (!user) return null

		const roles: string[] = user.rights ?? []

		const societies = user.UserSociety.map(societyOnUser => ({
			id: societyOnUser.society.id,
			name: societyOnUser.society.name,
			role: societyOnUser.role,
		}))

		return {
			id: user.id,
			email: user.email,
			name: user.name,
			roles,
			societies,
		}
	}

	async inviteUser(dto: InviteUserDto, invitedById: string) {
		// Перевірити, що ініціатор — manager товариства
		const society = await this.prisma.society.findUnique({
			where: { id: dto.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== invitedById)
			throw new ForbiddenException('Only manager can invite users')

		// Перевірити, чи вже існує такий інвайт
		const existing = await this.prisma.invite.findFirst({
			where: { societyId: dto.societyId, email: dto.email, status: 'pending' },
		})
		if (existing)
			throw new ConflictException('Invite already sent to this email')

		const token = uuidv4()

		return this.prisma.invite.create({
			data: {
				societyId: dto.societyId,
				email: dto.email,
				role: dto.role || 'member',
				token,
				status: 'pending',
				invitedById,
			},
		})
	}

	async acceptInvite(token: string, userId: string) {
		const invite = await this.prisma.invite.findUnique({ where: { token } })
		if (!invite) throw new NotFoundException('Invite not found')
		if (invite.status !== 'pending')
			throw new ConflictException('Invite already used or rejected')

		// Додаємо зв’язок у UserSociety
		await this.prisma.userSociety.create({
			data: {
				userId,
				societyId: invite.societyId,
				role: invite.role,
			},
		})
		await this.prisma.invite.update({
			where: { id: invite.id },
			data: { status: 'accepted' },
		})
		return { message: 'Invite accepted' }
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

	async getSocietyUsers(societyId: string, requesterId: string) {
		// Дозволено лише manager або member товариства
		const society = await this.prisma.society.findUnique({
			where: { id: societyId },
		})
		if (!society) throw new NotFoundException('Society not found')

		// Перевірка на наявність у складі товариства (можна винести в guard/policy)
		const membership = await this.prisma.userSociety.findFirst({
			where: { userId: requesterId, societyId },
		})
		if (!membership) throw new ForbiddenException('Access denied')

		// Повертаємо список з ролями
		return this.prisma.userSociety.findMany({
			where: { societyId },
			include: { user: true },
		})
	}
}

import { AuthDto } from '@/auth/dto/auth.dto'
import { TUserSocial } from '@/auth/social-media/social-media-auth.types'
import { VERIFY_EMAIL_URL } from '@/constants'
import { EmailService } from '@/email/email.service'
import { Injectable } from '@nestjs/common'
import type { User } from '@prisma/client'
import { hash } from 'argon2'

import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private emailService: EmailService
	) {}

	async getUsers() {
		return this.prisma.user.findMany({
			select: {
				name: true,
				email: true,
				id: true,
				password: false
			}
		})
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			}
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async findOrCreateSocialUser(profile: TUserSocial) {
		const email = profile.email
		let user: User | null = null

		if (email) {
			user = await this.getByEmail(email)
		}

		if (!user) {
			user = await this._createSocialUser(profile)
		}

		return user
	}

	private async _createSocialUser(profile: TUserSocial): Promise<User> {
		const verificationToken = profile.email
			? {
					verificationToken: null
				}
			: {}

		return this.prisma.user.create({
			data: {
				email: profile.email || '',
				name: profile.name || '',
				password: '',
				...verificationToken,
				avatarPath: profile.avatarPath || null
			}
		})
	}

	async create(dto: AuthDto) {
		return this.prisma.user.create({
			data: {
				...dto,
				password: await hash(dto.password)
			}
		})
	}

	async update(id: string, data: Partial<User>) {
		const user = await this.prisma.user.update({
			where: {
				id
			},
			data
		})

		await this.emailService.sendVerification(
			user.email,
			`${VERIFY_EMAIL_URL}${user.verificationToken}`
		)

		return user
	}
}

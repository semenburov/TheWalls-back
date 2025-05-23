// src/modules/user/user.service.ts

import {
	Injectable,
	NotFoundException,
	ForbiddenException,
	ConflictException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { InviteUserDto } from './dto/invite-user.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async getProfile(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				societies: {
					include: {
						society: true,
					},
				},
			},
		})

		if (!user) return null

		const roles: string[] = user.rights ?? []

		const societies = user.societies.map(societyOnUser => ({
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

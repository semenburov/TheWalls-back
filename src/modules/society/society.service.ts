import { PrismaService } from '@/prisma/prisma.service'
import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CreateSocietyDto } from './dto/create-society.dto'
import { UpdateSocietyDto } from './dto/update-society.dto'
import { SocietyEntity } from './entities/society.entity'

@Injectable()
export class SocietyService {
	constructor(private readonly prisma: PrismaService) {}

	// async create(createSocietyDto: CreateSocietyDto, userId: string) {
	// 	// Користувач створює товариство та автоматично стає manager
	// 	return this.prisma.society.create({
	// 		data: {
	// 			...createSocietyDto,
	// 			managerId: userId,
	// 			users: { connect: { id: userId } },
	// 		},
	// 		include: { manager: true, users: true },
	// 	})
	// }

	async create(dto: CreateSocietyDto, userId: string): Promise<SocietyEntity> {
		const byName = await this.prisma.society.findUnique({
			where: { name: dto.name },
		})
		if (byName) throw new ConflictException('Товариство з таким name вже існує')
		const byEmail = await this.prisma.society.findUnique({
			where: { email: dto.email },
		})
		if (byEmail)
			throw new ConflictException('Товариство з таким email вже існує')
		// 1. Створюємо товариство
		const society = await this.prisma.society.create({
			data: {
				...dto,
				managerId: userId,
				createdBy: userId,
				status: 'DRAFT',
				users: { connect: { id: userId } },
			},
			include: { manager: true, users: true },
		})

		// 2. Додаємо користувача-створювача як менеджера
		await this.prisma.userSociety.create({
			data: {
				userId,
				societyId: society.id,
				role: 'MANAGER', // або твоя роль за замовчуванням
			},
		})

		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (!user.rights.includes('MANAGER')) {
			await this.prisma.user.update({
				where: { id: userId },
				data: {
					rights: {
						push: 'MANAGER',
					},
				},
			})
		}

		return society
	}

	async findAll(userId: string) {
		// Отримати всі товариства, де користувач є учасником або менеджером
		return this.prisma.society.findMany({
			where: {
				OR: [{ managerId: userId }, { users: { some: { id: userId } } }],
			},
		})
	}

	async findOne(id: string, userId: string) {
		const society = await this.prisma.society.findUnique({ where: { id } })
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Access denied')
		return society
	}

	async update(id: string, dto: UpdateSocietyDto, userId: string) {
		const society = await this.prisma.society.findUnique({ where: { id } })
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Access denied')
		return this.prisma.society.update({ where: { id }, data: dto })
	}

	async remove(id: string, userId: string) {
		const society = await this.prisma.society.findUnique({ where: { id } })
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Access denied')
		return this.prisma.society.delete({ where: { id } })
	}
}

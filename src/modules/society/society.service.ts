import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateSocietyDto } from './dto/create-society.dto'
import { UpdateSocietyDto } from './dto/update-society.dto'

@Injectable()
export class SocietyService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createSocietyDto: CreateSocietyDto, userId: string) {
		// Користувач створює товариство та автоматично стає manager
		return this.prisma.society.create({
			data: {
				...createSocietyDto,
				managerId: userId,
				users: { connect: { id: userId } },
			},
			include: { manager: true, users: true },
		})
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

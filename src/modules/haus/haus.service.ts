// src/modules/haus/haus.service.ts

import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateHausDto } from './dto/create-haus.dto'
import { UpdateHausDto } from './dto/update-haus.dto'

@Injectable()
export class HausService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createHausDto: CreateHausDto, userId: string) {
		// Перевіряємо чи користувач має право створювати об'єкт у цьому товаристві (менеджер)
		const society = await this.prisma.society.findUnique({
			where: { id: createHausDto.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can add hauses')

		return this.prisma.haus.create({ data: createHausDto })
	}

	async findAllBySociety(societyId: string, userId: string) {
		// Перевіряємо чи користувач має доступ до товариства
		const society = await this.prisma.society.findUnique({
			where: { id: societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		// доступ дозволений всім користувачам цього товариства
		return this.prisma.haus.findMany({ where: { societyId } })
	}

	async findOne(id: string, userId: string) {
		const haus = await this.prisma.haus.findUnique({ where: { id } })
		if (!haus) throw new NotFoundException('Haus not found')
		// додати перевірку, що user належить до society або є manager
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		return haus
	}

	async update(id: string, dto: UpdateHausDto, userId: string) {
		const haus = await this.prisma.haus.findUnique({ where: { id } })
		if (!haus) throw new NotFoundException('Haus not found')
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can update hauses')

		return this.prisma.haus.update({ where: { id }, data: dto })
	}

	async remove(id: string, userId: string) {
		const haus = await this.prisma.haus.findUnique({ where: { id } })
		if (!haus) throw new NotFoundException('Haus not found')
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can delete hauses')

		return this.prisma.haus.delete({ where: { id } })
	}
}

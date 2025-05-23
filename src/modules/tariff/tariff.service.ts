// src/modules/tariff/tariff.service.ts

import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateTariffDto } from './dto/create-tariff.dto'
import { UpdateTariffDto } from './dto/update-tariff.dto'

@Injectable()
export class TariffService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createTariffDto: CreateTariffDto, userId: string) {
		// Дозволяємо створення тарифу тільки менеджеру товариства
		const society = await this.prisma.society.findUnique({
			where: { id: createTariffDto.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can add tariffs')

		return this.prisma.tariff.create({ data: createTariffDto })
	}

	async findAllBySociety(societyId: string, userId: string) {
		const society = await this.prisma.society.findUnique({
			where: { id: societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		// доступ дозволений всім учасникам товариства
		return this.prisma.tariff.findMany({ where: { societyId } })
	}

	async findOne(id: string, userId: string) {
		const tariff = await this.prisma.tariff.findUnique({ where: { id } })
		if (!tariff) throw new NotFoundException('Tariff not found')
		const society = await this.prisma.society.findUnique({
			where: { id: tariff.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		return tariff
	}

	async update(id: string, dto: UpdateTariffDto, userId: string) {
		const tariff = await this.prisma.tariff.findUnique({ where: { id } })
		if (!tariff) throw new NotFoundException('Tariff not found')
		const society = await this.prisma.society.findUnique({
			where: { id: tariff.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can update tariffs')

		return this.prisma.tariff.update({ where: { id }, data: dto })
	}

	async remove(id: string, userId: string) {
		const tariff = await this.prisma.tariff.findUnique({ where: { id } })
		if (!tariff) throw new NotFoundException('Tariff not found')
		const society = await this.prisma.society.findUnique({
			where: { id: tariff.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can delete tariffs')

		return this.prisma.tariff.delete({ where: { id } })
	}
}

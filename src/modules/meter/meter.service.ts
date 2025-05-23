// src/modules/meter/meter.service.ts

import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateMeterDto } from './dto/create-meter.dto'
import { UpdateMeterDto } from './dto/update-meter.dto'

@Injectable()
export class MeterService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createMeterDto: CreateMeterDto, userId: string) {
		// Перевіряємо, чи користувач — manager відповідного товариства
		const haus = await this.prisma.haus.findUnique({
			where: { id: createMeterDto.hausId },
		})
		if (!haus) throw new NotFoundException('Haus not found')
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can add meters')

		return this.prisma.meter.create({ data: createMeterDto })
	}

	async findAllByHaus(hausId: string, userId: string) {
		const haus = await this.prisma.haus.findUnique({ where: { id: hausId } })
		if (!haus) throw new NotFoundException('Haus not found')
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		// доступ дозволений всім учасникам товариства
		return this.prisma.meter.findMany({ where: { hausId } })
	}

	async findOne(id: string, userId: string) {
		const meter = await this.prisma.meter.findUnique({ where: { id } })
		if (!meter) throw new NotFoundException('Meter not found')
		const haus = await this.prisma.haus.findUnique({
			where: { id: meter.hausId },
		})
		if (!haus) throw new NotFoundException('Haus not found')
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		return meter
	}

	async update(id: string, dto: UpdateMeterDto, userId: string) {
		const meter = await this.prisma.meter.findUnique({ where: { id } })
		if (!meter) throw new NotFoundException('Meter not found')
		const haus = await this.prisma.haus.findUnique({
			where: { id: meter.hausId },
		})
		if (!haus) throw new NotFoundException('Haus not found')
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can update meters')

		return this.prisma.meter.update({ where: { id }, data: dto })
	}

	async remove(id: string, userId: string) {
		const meter = await this.prisma.meter.findUnique({ where: { id } })
		if (!meter) throw new NotFoundException('Meter not found')
		const haus = await this.prisma.haus.findUnique({
			where: { id: meter.hausId },
		})
		if (!haus) throw new NotFoundException('Haus not found')
		const society = await this.prisma.society.findUnique({
			where: { id: haus.societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		if (society.managerId !== userId)
			throw new ForbiddenException('Only manager can delete meters')

		return this.prisma.meter.delete({ where: { id } })
	}
}

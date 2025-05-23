// src/modules/report/report.service.ts

import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateMeterReportDto } from './dto/create-meterReport.dto'
import { UpdateMeterReportDto } from './dto/update-meterReport.dto'

@Injectable()
export class MeterReportService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateMeterReportDto, userId: string) {
		// Перевірка, чи user має право подавати показання для цього лічильника
		const meter = await this.prisma.meter.findUnique({
			where: { id: dto.meterId },
		})
		if (!meter) throw new NotFoundException('Meter not found')

		// TODO: можеш додати додаткову перевірку доступу (належність до Society/Haus)
		return this.prisma.report.create({
			data: {
				value: dto.value,
				date: new Date(dto.date),
				meterId: dto.meterId,
				userId,
			},
		})
	}

	async findAllByMeter(meterId: string, userId: string) {
		// Доступний для будь-якого користувача, що має доступ до лічильника
		return this.prisma.report.findMany({ where: { meterId } })
	}

	async findOne(id: string, userId: string) {
		const report = await this.prisma.report.findUnique({ where: { id } })
		if (!report) throw new NotFoundException('Report not found')
		return report
	}

	async update(id: string, dto: UpdateMeterReportDto, userId: string) {
		const report = await this.prisma.report.findUnique({ where: { id } })
		if (!report) throw new NotFoundException('Report not found')
		// Дозволити змінювати лише тому, хто подав, або менеджеру (цю перевірку можна додати)
		if (report.userId !== userId)
			throw new ForbiddenException('Only author can update report')
		return this.prisma.report.update({
			where: { id },
			data: { ...dto, date: dto.date ? new Date(dto.date) : undefined },
		})
	}

	async remove(id: string, userId: string) {
		const report = await this.prisma.report.findUnique({ where: { id } })
		if (!report) throw new NotFoundException('Report not found')
		if (report.userId !== userId)
			throw new ForbiddenException('Only author can delete report')
		return this.prisma.report.delete({ where: { id } })
	}
}

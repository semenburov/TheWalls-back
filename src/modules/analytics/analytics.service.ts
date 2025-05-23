// src/modules/analytics/analytics.service.ts

import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AnalyticsService {
	constructor(private readonly prisma: PrismaService) {}

	// 1. Сума по всіх показаннях лічильника (за місяць)
	async getMeterSum(
		meterId: string,
		year: number,
		month: number,
		userId: string
	) {
		// Перевірка доступу опціонально
		const start = new Date(year, month - 1, 1)
		const end = new Date(year, month, 1)
		const reports = await this.prisma.report.findMany({
			where: {
				meterId,
				date: { gte: start, lt: end },
			},
		})
		const sum = reports.reduce((acc, r) => acc + r.value, 0)
		return { meterId, year, month, sum }
	}

	// 2. Нарахування до сплати по об’єкту (haus) з урахуванням тарифу
	async getHausDebt(
		hausId: string,
		year: number,
		month: number,
		userId: string
	) {
		// Всі лічильники цього об’єкта
		const meters = await this.prisma.meter.findMany({ where: { hausId } })
		if (!meters.length) return { hausId, year, month, total: 0, details: [] }

		// Знаходимо актуальні тарифи для лічильників
		const meterTypes = meters.map(m => m.type)
		const haus = await this.prisma.haus.findUnique({ where: { id: hausId } })
		const societyId = haus?.societyId
		const tariffs = await this.prisma.tariff.findMany({
			where: { societyId, type: { in: meterTypes } },
		})

		const details = []
		let total = 0

		for (const meter of meters) {
			// Знайти тариф для типу лічильника
			const tariff = tariffs.find(t => t.type === meter.type)
			if (!tariff) continue

			// Сума показань за місяць
			const start = new Date(year, month - 1, 1)
			const end = new Date(year, month, 1)
			const reports = await this.prisma.report.findMany({
				where: { meterId: meter.id, date: { gte: start, lt: end } },
			})
			const sum = reports.reduce((acc, r) => acc + r.value, 0)
			const amount = sum * tariff.price
			total += amount
			details.push({
				meterId: meter.id,
				type: meter.type,
				sum,
				tariff: tariff.price,
				amount,
			})
		}

		return { hausId, year, month, total, details }
	}

	// 3. Загальна статистика по товариству (dashboard)
	async getSocietyStats(societyId: string, userId: string) {
		// Перевірка доступу
		const society = await this.prisma.society.findUnique({
			where: { id: societyId },
		})
		if (!society) throw new NotFoundException('Society not found')
		// TODO: Перевірка членства

		const hauses = await this.prisma.haus.count({ where: { societyId } })
		const meters = await this.prisma.meter.count({
			where: { haus: { societyId } },
		})
		const users = await this.prisma.userSociety.count({ where: { societyId } })
		return { societyId, hauses, meters, users }
	}
}

// src/modules/analytics/analytics.controller.ts

import { Controller, Get, UseGuards, Query, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '@/auth/guards/jwt.guard'

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('meter-sum')
	@ApiOperation({ summary: 'Сума показань по лічильнику за місяць' })
	async getMeterSum(
		@Query('meterId') meterId: string,
		@Query('year') year: string,
		@Query('month') month: string,
		@Request() req
	) {
		return this.analyticsService.getMeterSum(
			meterId,
			+year,
			+month,
			req.user.id
		)
	}

	@Get('haus-debt')
	@ApiOperation({ summary: 'Нарахування по об’єкту за місяць' })
	async getHausDebt(
		@Query('hausId') hausId: string,
		@Query('year') year: string,
		@Query('month') month: string,
		@Request() req
	) {
		return this.analyticsService.getHausDebt(hausId, +year, +month, req.user.id)
	}

	@Get('society-stats')
	@ApiOperation({ summary: 'Загальна статистика по товариству' })
	async getSocietyStats(@Query('societyId') societyId: string, @Request() req) {
		return this.analyticsService.getSocietyStats(societyId, req.user.id)
	}
}

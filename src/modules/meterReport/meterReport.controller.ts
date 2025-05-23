// src/modules/report/report.controller.ts

import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request,
	Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { MeterReportService } from './meterReport.service'
import { CreateMeterReportDto } from './dto/create-meterReport.dto'
import { UpdateMeterReportDto } from './dto/update-meterReport.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt.guard'

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class MeterReportController {
	constructor(private readonly reportService: MeterReportService) {}

	@Post()
	@ApiOperation({ summary: 'Подати показник лічильника' })
	async create(@Body() dto: CreateMeterReportDto, @Request() req) {
		return this.reportService.create(dto, req.user.id)
	}

	@Get()
	@ApiOperation({ summary: 'Список показань для лічильника' })
	async findAll(@Query('meterId') meterId: string, @Request() req) {
		return this.reportService.findAllByMeter(meterId, req.user.id)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Деталі показання' })
	async findOne(@Param('id') id: string, @Request() req) {
		return this.reportService.findOne(id, req.user.id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Оновити показання (тільки автор)' })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateMeterReportDto,
		@Request() req
	) {
		return this.reportService.update(id, dto, req.user.id)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Видалити показання (тільки автор)' })
	async remove(@Param('id') id: string, @Request() req) {
		return this.reportService.remove(id, req.user.id)
	}
}

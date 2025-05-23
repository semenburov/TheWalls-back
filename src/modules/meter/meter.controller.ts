// src/modules/meter/meter.controller.ts

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
import { MeterService } from './meter.service'
import { CreateMeterDto } from './dto/create-meter.dto'
import { UpdateMeterDto } from './dto/update-meter.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt.guard'

@ApiTags('Meters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meters')
export class MeterController {
	constructor(private readonly meterService: MeterService) {}

	@Post()
	@ApiOperation({ summary: 'Створити новий лічильник (доступно manager)' })
	async create(@Body() dto: CreateMeterDto, @Request() req) {
		return this.meterService.create(dto, req.user.id)
	}

	@Get()
	@ApiOperation({ summary: "Список лічильників для об'єкта" })
	async findAll(@Query('hausId') hausId: string, @Request() req) {
		return this.meterService.findAllByHaus(hausId, req.user.id)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Деталі лічильника' })
	async findOne(@Param('id') id: string, @Request() req) {
		return this.meterService.findOne(id, req.user.id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Оновити лічильник (доступно manager)' })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateMeterDto,
		@Request() req
	) {
		return this.meterService.update(id, dto, req.user.id)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Видалити лічильник (доступно manager)' })
	async remove(@Param('id') id: string, @Request() req) {
		return this.meterService.remove(id, req.user.id)
	}
}

// src/modules/tariff/tariff.controller.ts

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
import { TariffService } from './tariff.service'
import { CreateTariffDto } from './dto/create-tariff.dto'
import { UpdateTariffDto } from './dto/update-tariff.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt.guard'

@ApiTags('Tariffs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tariffs')
export class TariffController {
	constructor(private readonly tariffService: TariffService) {}

	@Post()
	@ApiOperation({ summary: 'Створити новий тариф (доступно manager)' })
	async create(@Body() dto: CreateTariffDto, @Request() req) {
		return this.tariffService.create(dto, req.user.id)
	}

	@Get()
	@ApiOperation({ summary: 'Список тарифів товариства' })
	async findAll(@Query('societyId') societyId: string, @Request() req) {
		return this.tariffService.findAllBySociety(societyId, req.user.id)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Деталі тарифу' })
	async findOne(@Param('id') id: string, @Request() req) {
		return this.tariffService.findOne(id, req.user.id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Оновити тариф (доступно manager)' })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateTariffDto,
		@Request() req
	) {
		return this.tariffService.update(id, dto, req.user.id)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Видалити тариф (доступно manager)' })
	async remove(@Param('id') id: string, @Request() req) {
		return this.tariffService.remove(id, req.user.id)
	}
}

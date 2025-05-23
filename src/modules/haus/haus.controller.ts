// src/modules/haus/haus.controller.ts

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
import { HausService } from './haus.service'
import { CreateHausDto } from './dto/create-haus.dto'
import { UpdateHausDto } from './dto/update-haus.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt.guard'

@ApiTags('Hauses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hauses')
export class HausController {
	constructor(private readonly hausService: HausService) {}

	@Post()
	@ApiOperation({ summary: "Створити новий об'єкт (доступно manager)" })
	async create(@Body() dto: CreateHausDto, @Request() req) {
		return this.hausService.create(dto, req.user.id)
	}

	@Get()
	@ApiOperation({ summary: "Список об'єктів товариства" })
	async findAll(@Query('societyId') societyId: string, @Request() req) {
		return this.hausService.findAllBySociety(societyId, req.user.id)
	}

	@Get(':id')
	@ApiOperation({ summary: "Деталі об'єкта" })
	async findOne(@Param('id') id: string, @Request() req) {
		return this.hausService.findOne(id, req.user.id)
	}

	@Patch(':id')
	@ApiOperation({ summary: "Оновити об'єкт (доступно manager)" })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateHausDto,
		@Request() req
	) {
		return this.hausService.update(id, dto, req.user.id)
	}

	@Delete(':id')
	@ApiOperation({ summary: "Видалити об'єкт (доступно manager)" })
	async remove(@Param('id') id: string, @Request() req) {
		return this.hausService.remove(id, req.user.id)
	}
}

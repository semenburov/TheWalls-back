import { JwtAuthGuard } from '@/auth/guards/jwt.guard'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { CreateSocietyDto } from './dto/create-society.dto'
import { UpdateSocietyDto } from './dto/update-society.dto'
import { SocietyEntity } from './entities/society.entity'
import { SocietyService } from './society.service'

@ApiTags('Societies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('societies')
export class SocietyController {
	constructor(private readonly societyService: SocietyService) {}

	@Post()
	@ApiOperation({ summary: 'Створити нове товариство (автор стає manager)' })
	@ApiResponse({
		status: 201,
		description: 'Товариство створено',
		type: SocietyEntity,
	})
	@ApiResponse({
		status: 409,
		description: 'Товариство з таким email або name вже існує',
	})
	async create(@Body() dto: CreateSocietyDto, @Request() req) {
		return this.societyService.create(dto, req.user.id)
	}

	@Get()
	@ApiOperation({
		summary: 'Список товариств користувача (учасник або manager)',
	})
	async findAll(@Request() req) {
		return this.societyService.findAll(req.user.id)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Деталі товариства (доступно manager)' })
	async findOne(@Param('id') id: string, @Request() req) {
		return this.societyService.findOne(id, req.user.id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Оновити товариство (доступно manager)' })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateSocietyDto,
		@Request() req
	) {
		return this.societyService.update(id, dto, req.user.id)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Видалити товариство (доступно manager)' })
	async remove(@Param('id') id: string, @Request() req) {
		return this.societyService.remove(id, req.user.id)
	}
}

import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateEstateObjectDto } from './dto/create-estateObject.dto'
import { FilterEstateObjectDto } from './dto/filter-estateObject.dto'
import { UpdateEstateObjectDto } from './dto/update-estateObject.dto'
import { EstateObjectEntity } from './entities/estateObject.entity'
import { EstateObjectService } from './estateObject.service'

@ApiTags('Objects')
@Controller('objects')
export class EstateObjectController {
	constructor(private readonly estateObjectService: EstateObjectService) {}

	@Post()
	@ApiOperation({ summary: 'Створити обʼєкт' })
	@ApiResponse({ type: EstateObjectEntity })
	create(@Body() dto: CreateEstateObjectDto) {
		return this.estateObjectService.create(dto)
	}

	@Get()
	@ApiOperation({ summary: 'Список обʼєктів з фільтрацією' })
	@ApiResponse({ type: [EstateObjectEntity] })
	findAll(@Query() filter: FilterEstateObjectDto) {
		return this.estateObjectService.findAll(filter)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Деталі обʼєкта' })
	@ApiResponse({ type: EstateObjectEntity })
	findOne(@Param('id') id: string) {
		return this.estateObjectService.findOne(id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Оновити обʼєкт' })
	@ApiResponse({ type: EstateObjectEntity })
	update(@Param('id') id: string, @Body() dto: UpdateEstateObjectDto) {
		return this.estateObjectService.update(id, dto)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Видалити обʼєкт' })
	remove(@Param('id') id: string) {
		return this.estateObjectService.remove(id)
	}
}

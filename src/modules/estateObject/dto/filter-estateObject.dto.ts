import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { EstateObjectType } from '../entities/estateObject.entity'

export class FilterEstateObjectDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	name?: string

	@ApiPropertyOptional({ enum: EstateObjectType })
	@IsOptional()
	@IsEnum(EstateObjectType)
	type?: EstateObjectType

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	ownerId?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	societyId?: string
}

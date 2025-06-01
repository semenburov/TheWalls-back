import { ApiProperty } from '@nestjs/swagger'
import {
	ArrayUnique,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'
import { EstateObjectType } from '../entities/estateObject.entity'

export class CreateEstateObjectDto {
	@ApiProperty({ example: 'Підʼїзд 1' })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ enum: EstateObjectType })
	@IsEnum(EstateObjectType)
	type: EstateObjectType

	@ApiProperty({ example: 42.5 })
	@IsNumber()
	@Min(0.1)
	area: number

	@ApiProperty({ example: 'society-uuid' })
	@IsNotEmpty()
	@IsString()
	societyId: string

	@ApiProperty({ example: 'parent-object-uuid', required: false })
	@IsOptional()
	@IsString()
	parentId?: string

	@ApiProperty({
		example: ['user-uuid1', 'user-uuid2'],
		required: false,
		type: [String],
	})
	@IsOptional()
	@ArrayUnique()
	ownerIds?: string[]
}

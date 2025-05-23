// src/modules/haus/dto/create-haus.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateHausDto {
	@ApiProperty({ example: 'Квартира 5' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({
		example: 'apartment',
		description: 'Тип: apartment, garage, plot і т.п.',
	})
	@IsString()
	@IsNotEmpty()
	type: string

	@ApiProperty({ example: 'вул. Сонячна, 5', required: false })
	@IsString()
	@IsOptional()
	address?: string

	@ApiProperty({ example: 'uuid-суспільства' })
	@IsString()
	@IsNotEmpty()
	societyId: string

	@ApiProperty({ example: 'uuid-користувача (власника)', required: false })
	@IsString()
	@IsOptional()
	ownerId?: string
}

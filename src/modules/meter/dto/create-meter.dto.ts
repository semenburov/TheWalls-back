// src/modules/meter/dto/create-meter.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateMeterDto {
	@ApiProperty({
		example: 'water',
		description: 'Тип лічильника: water, gas, electricity і т.п.',
	})
	@IsString()
	@IsNotEmpty()
	type: string

	@ApiProperty({ example: 'W123456' })
	@IsString()
	@IsNotEmpty()
	serial: string

	@ApiProperty({ example: 'Кухня', required: false })
	@IsString()
	@IsOptional()
	location?: string

	@ApiProperty({ example: 'uuid Haus' })
	@IsString()
	@IsNotEmpty()
	hausId: string
}

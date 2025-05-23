// src/modules/tariff/dto/create-tariff.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateTariffDto {
	@ApiProperty({ example: 'Тариф для холодної води' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({
		example: 'water',
		description: 'Тип ресурсу: water, gas, electricity і т.п.',
	})
	@IsString()
	@IsNotEmpty()
	type: string

	@ApiProperty({ example: 49.99 })
	@IsNumber()
	price: number

	@ApiProperty({ example: 'uuid товариства' })
	@IsString()
	@IsNotEmpty()
	societyId: string
}

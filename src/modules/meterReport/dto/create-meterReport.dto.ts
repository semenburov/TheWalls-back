// src/modules/report/dto/create-meterReport.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsString, IsDateString } from 'class-validator'

export class CreateMeterReportDto {
	@ApiProperty({ example: 123.45, description: 'Показник' })
	@IsNumber()
	@IsNotEmpty()
	value: number

	@ApiProperty({ example: '2024-05-25', description: 'Дата або період' })
	@IsDateString()
	date: string

	@ApiProperty({ example: 'uuid Meter' })
	@IsString()
	meterId: string
}

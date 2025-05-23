// src/modules/report/entities/report.entity.ts

import { ApiProperty } from '@nestjs/swagger'

export class MeterReportEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	value: number

	@ApiProperty()
	date: Date

	@ApiProperty()
	meterId: string

	@ApiProperty()
	userId: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

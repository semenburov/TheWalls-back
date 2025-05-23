// src/modules/meter/entities/meter.entity.ts

import { ApiProperty } from '@nestjs/swagger'

export class MeterEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	type: string

	@ApiProperty()
	serial: string

	@ApiProperty({ required: false })
	location?: string

	@ApiProperty()
	hausId: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

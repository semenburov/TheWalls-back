// src/modules/tariff/entities/tariff.entity.ts

import { ApiProperty } from '@nestjs/swagger'

export class TariffEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiProperty()
	type: string

	@ApiProperty()
	price: number

	@ApiProperty()
	societyId: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

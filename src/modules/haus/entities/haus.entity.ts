// src/modules/haus/entities/haus.entity.ts

import { ApiProperty } from '@nestjs/swagger'

export class HausEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiProperty()
	type: string

	@ApiProperty({ required: false })
	address?: string

	@ApiProperty()
	societyId: string

	@ApiProperty({ required: false })
	ownerId?: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

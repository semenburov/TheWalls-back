// src/modules/user/entities/user.entity.ts

import { ApiProperty } from '@nestjs/swagger'

export class UserEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	email: string

	@ApiProperty({ required: false })
	name?: string
}

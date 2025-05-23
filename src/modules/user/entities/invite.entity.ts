// src/modules/user/entities/invite.entity.ts

import { ApiProperty } from '@nestjs/swagger'

export class InviteEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	societyId: string

	@ApiProperty()
	email: string

	@ApiProperty()
	token: string

	@ApiProperty()
	role: string

	@ApiProperty()
	status: string

	@ApiProperty()
	invitedById: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

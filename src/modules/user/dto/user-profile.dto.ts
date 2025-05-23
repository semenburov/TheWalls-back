// src/modules/user/dto/user-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger'

export class SocietyProfileDto {
	@ApiProperty() id: string
	@ApiProperty() name: string
	@ApiProperty() role: string
}

export class UserProfileDto {
	@ApiProperty() id: string
	@ApiProperty() email: string
	@ApiProperty({ required: false }) name?: string
	@ApiProperty({ type: [String] }) roles: string[]
	@ApiProperty({ type: [SocietyProfileDto] }) societies: SocietyProfileDto[]
}

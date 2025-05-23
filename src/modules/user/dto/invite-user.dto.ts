// src/modules/user/dto/invite-user.dto.ts

import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsOptional } from 'class-validator'

export class InviteUserDto {
	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	email: string

	@ApiProperty({ example: 'member', required: false, default: 'member' })
	@IsString()
	@IsOptional()
	role?: string

	@ApiProperty({ example: 'uuid товариства' })
	@IsString()
	societyId: string
}

// src/modules/user/dto/update-user.dto.ts

import { PartialType, ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'
import { UserEntity } from '../entities/user.entity'

export class UpdateUserDto extends PartialType(UserEntity) {
	@ApiProperty({ example: 'Новий email', required: false })
	@IsEmail()
	@IsOptional()
	email?: string

	@ApiProperty({ example: 'Імʼя користувача', required: false })
	@IsString()
	@IsOptional()
	name?: string

	@ApiProperty({ example: 'Новий пароль', required: false })
	@IsString()
	@IsOptional()
	password?: string
}

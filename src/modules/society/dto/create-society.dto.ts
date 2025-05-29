import { ApiProperty } from '@nestjs/swagger'
import { SocietyStatus, SocietyType } from '@prisma/client'
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from 'class-validator'

export class CreateSocietyDto {
	@ApiProperty({ example: 'ЖБК Сонячний' })
	@IsString()
	@IsNotEmpty()
	@Length(3, 100)
	name: string

	@ApiProperty({ example: 'osbb@email.com' })
	@IsEmail()
	email: string

	@ApiProperty({ example: '+380501234567', required: false })
	@IsOptional()
	@IsString()
	phone?: string

	@ApiProperty({
		example: 'osbb',
		description: 'Тип товариства: osbb, garage, дача і т.п.',
	})
	@IsString()
	@IsNotEmpty()
	@IsEnum(SocietyType)
	type: SocietyType

	@IsNotEmpty()
	@IsEnum(SocietyStatus)
	status: SocietyStatus

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	@Length(0, 500)
	description?: string

	@ApiProperty({ example: 'м. Київ, вул. Сонячна, 1', required: false })
	@IsString()
	@IsOptional()
	address?: string

	@ApiProperty()
	managerId: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

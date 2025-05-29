import { ApiProperty } from '@nestjs/swagger'
import { SocietyStatus, SocietyType } from '@prisma/client'
import { IsEnum } from 'class-validator'

export class SocietyEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiProperty()
	phone?: string

	@ApiProperty()
	email: string

	@ApiProperty({ enum: SocietyType })
	@IsEnum(SocietyType)
	type: SocietyType

	@ApiProperty()
	description?: string

	@ApiProperty({ required: false })
	address?: string

	@ApiProperty({ enum: SocietyStatus })
	@IsEnum(SocietyStatus)
	status: SocietyStatus

	@ApiProperty()
	managerId: string

	@ApiProperty()
	createdBy: string

	@ApiProperty()
	updatedBy: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

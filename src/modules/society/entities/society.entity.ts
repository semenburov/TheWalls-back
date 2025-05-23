import { ApiProperty } from '@nestjs/swagger'

export class SocietyEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiProperty()
	type: string

	@ApiProperty({ required: false })
	address?: string

	@ApiProperty()
	managerId: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

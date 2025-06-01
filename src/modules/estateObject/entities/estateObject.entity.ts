import { ApiProperty } from '@nestjs/swagger'

export enum EstateObjectType {
	STREET = 'STREET',
	ENTRANCE = 'ENTRANCE',
	PLOT = 'PLOT',
	APARTMENT = 'APARTMENT',
}

export class EstateObjectEntity {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string

	@ApiProperty({ enum: EstateObjectType })
	type: EstateObjectType

	@ApiProperty()
	area: number

	@ApiProperty()
	societyId: string

	@ApiProperty({ required: false })
	parentId?: string

	@ApiProperty({ type: [String] })
	ownerIds: string[]

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date
}

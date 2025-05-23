import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateSocietyDto {
	@ApiProperty({ example: 'ЖБК Сонячний' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({
		example: 'osbb',
		description: 'Тип товариства: osbb, garage, дача і т.п.',
	})
	@IsString()
	@IsNotEmpty()
	type: string

	@ApiProperty({ example: 'м. Київ, вул. Сонячна, 1', required: false })
	@IsString()
	@IsOptional()
	address?: string
}

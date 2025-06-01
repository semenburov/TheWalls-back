import { PartialType } from '@nestjs/swagger'
import { CreateEstateObjectDto } from './create-estateObject.dto'

export class UpdateEstateObjectDto extends PartialType(CreateEstateObjectDto) {}

// src/modules/meter/dto/update-meter.dto.ts

import { PartialType } from '@nestjs/swagger'
import { CreateMeterDto } from './create-meter.dto'

export class UpdateMeterDto extends PartialType(CreateMeterDto) {}

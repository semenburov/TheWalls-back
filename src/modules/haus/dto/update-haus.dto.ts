// src/modules/haus/dto/update-haus.dto.ts

import { PartialType } from '@nestjs/swagger'
import { CreateHausDto } from './create-haus.dto'

export class UpdateHausDto extends PartialType(CreateHausDto) {}

// src/modules/report/dto/update-report.dto.ts

import { PartialType } from '@nestjs/swagger'
import { CreateMeterReportDto } from './create-meterReport.dto'

export class UpdateMeterReportDto extends PartialType(CreateMeterReportDto) {}

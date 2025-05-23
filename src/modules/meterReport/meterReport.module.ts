// src/modules/report/report.module.ts

import { Module } from '@nestjs/common'
import { MeterReportService } from './meterReport.service'
import { MeterReportController } from './meterReport.controller'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	controllers: [MeterReportController],
	providers: [MeterReportService],
})
export class MeterReportModule {}

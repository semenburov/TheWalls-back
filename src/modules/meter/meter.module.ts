// src/modules/meter/meter.module.ts

import { Module } from '@nestjs/common'
import { MeterService } from './meter.service'
import { MeterController } from './meter.controller'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	controllers: [MeterController],
	providers: [MeterService],
})
export class MeterModule {}

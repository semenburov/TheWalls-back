// src/modules/tariff/tariff.module.ts

import { Module } from '@nestjs/common'
import { TariffService } from './tariff.service'
import { TariffController } from './tariff.controller'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	controllers: [TariffController],
	providers: [TariffService],
})
export class TariffModule {}

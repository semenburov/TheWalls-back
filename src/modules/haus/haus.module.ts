// src/modules/haus/haus.module.ts

import { Module } from '@nestjs/common'
import { HausService } from './haus.service'
import { HausController } from './haus.controller'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	controllers: [HausController],
	providers: [HausService],
})
export class HausModule {}

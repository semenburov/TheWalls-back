import { Module } from '@nestjs/common'
import { SocietyService } from './society.service'
import { SocietyController } from './society.controller'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	controllers: [SocietyController],
	providers: [SocietyService],
})
export class SocietyModule {}

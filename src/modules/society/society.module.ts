import { Module } from '@nestjs/common'
import { SocietyService } from './society.service'
import { SocietyController } from './society.controller'
import { PrismaModule } from '@/prisma/prisma.module'

@Module({
	imports: [PrismaModule],
	controllers: [SocietyController],
	providers: [SocietyService],
	exports: [SocietyService], // якщо треба в інших модулях
})
export class SocietyModule {}

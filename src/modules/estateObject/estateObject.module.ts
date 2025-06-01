import { Module } from '@nestjs/common'
import { EstateObjectController } from './estateObject.controller'
import { EstateObjectService } from './estateObject.service'

@Module({
	controllers: [EstateObjectController],
	providers: [EstateObjectService],
})
export class EstateObjectModule {}

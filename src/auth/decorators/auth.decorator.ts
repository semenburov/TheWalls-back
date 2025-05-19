import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from '@prisma/client'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { RolesGuard } from '../guards/roles.guard'
import { Roles } from './roles.decorator'

export const Auth = (roles?: Role | Role[]) => {
	if (!roles) roles = [Role.USER, Role.ADMIN, Role.MANAGER, Role.PREMIUM]
	if (!Array.isArray(roles)) roles = [roles]
	return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard))
}

// src/modules/user/user.controller.ts

import {
	Controller,
	Post,
	Body,
	UseGuards,
	Request,
	Get,
	Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { UserService } from './user.service'
import { InviteUserDto } from './dto/invite-user.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt.guard'

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('invite')
	@ApiOperation({
		summary: 'Інвайт користувача в товариство (доступно manager)',
	})
	async invite(@Body() dto: InviteUserDto, @Request() req) {
		return this.userService.inviteUser(dto, req.user.id)
	}

	@Post('accept-invite')
	@ApiOperation({ summary: 'Прийняти інвайт по токену (auth user)' })
	async acceptInvite(@Body('token') token: string, @Request() req) {
		return this.userService.acceptInvite(token, req.user.id)
	}

	@Get('society')
	@ApiOperation({ summary: 'Отримати список користувачів товариства' })
	async getSocietyUsers(@Query('societyId') societyId: string, @Request() req) {
		return this.userService.getSocietyUsers(societyId, req.user.id)
	}
}

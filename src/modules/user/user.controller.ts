// src/modules/user/user.controller.ts

import { JwtAuthGuard } from '@/auth/guards/jwt.guard'
import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiTags,
	ApiResponse,
} from '@nestjs/swagger'
import { InviteUserDto } from './dto/invite-user.dto'
import { UserService } from './user.service'
import { UserProfileDto } from './dto/user-profile.dto'

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

	@ApiResponse({ status: 200, type: UserProfileDto })
	@Get('profile')
	@ApiOperation({
		summary: 'Повертає профіль користувача з ролями та списком товариств',
	})
	async getProfile(@Request() req) {
		return this.userService.getProfile(req.user.id)
	}
}

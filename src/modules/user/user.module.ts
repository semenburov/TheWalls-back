// src/modules/user/user.module.ts

import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaModule } from '@/prisma/prisma.module'
import { EmailModule } from '@/email/email.module'
import { PrismaService } from '@/prisma/prisma.service'
@Module({
	imports: [PrismaModule, EmailModule], // Імпортуємо EmailModule для можливості надсилати листи з UserService
	controllers: [UserController], // Реєструємо UserController (обробка HTTP-запитів, маршрути)
	providers: [UserService, PrismaService], // Реєструємо сервіси у DI контейнері (UserService для логіки, PrismaService для БД)
	exports: [UserService], // Експортуємо UserService для використання в інших модулях (наприклад, в AuthModule)
})
export class UserModule {} // Модуль користувачів: об'єднує логіку, контролер і сервіси для роботи з користувачами

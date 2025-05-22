import { EmailModule } from '@/email/email.module' // Модуль для роботи з email (відправка листів)
import { PrismaService } from '@/prisma.service' // Сервіс для роботи з базою даних через Prisma
import { Module } from '@nestjs/common' // Декоратор для оголошення модуля
import { UserController } from './user.controller' // Контролер для роботи з користувачами (маршрути)
import { UserService } from './user.service' // Сервіс для бізнес-логіки користувачів

@Module({
	imports: [EmailModule], // Імпортуємо EmailModule для можливості надсилати листи з UserService
	controllers: [UserController], // Реєструємо UserController (обробка HTTP-запитів, маршрути)
	providers: [UserService, PrismaService], // Реєструємо сервіси у DI контейнері (UserService для логіки, PrismaService для БД)
	exports: [UserService], // Експортуємо UserService для використання в інших модулях (наприклад, в AuthModule)
})
export class UserModule {} // Модуль користувачів: об'єднує логіку, контролер і сервіси для роботи з користувачами

import { SocialMediaAuthController } from '@/auth/social-media/social-media-auth.controller'
import { SocialMediaAuthService } from '@/auth/social-media/social-media-auth.service'
import { GithubStrategy } from '@/auth/strategies/github.strategy'
import { GoogleStrategy } from '@/auth/strategies/google.strategy'
import { EmailModule } from '@/email/email.module'
import { PrismaService } from '@/prisma.service'
import { UserModule } from '@/user/user.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshTokenService } from './refresh-token.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule], // Додаємо модуль конфігурації для доступу до змінних оточення
			inject: [ConfigService], // Інжектимо сервіс конфігурації для отримання налаштувань JWT
			useFactory: getJwtConfig, // Фабрика для асинхронної конфігурації JWT (секрет, термін дії тощо)
		}),
		UserModule, // Модуль користувачів (логіка, сервіси, репозиторії)
		EmailModule, // Модуль для роботи з email (відправка листів, підтвердження тощо)
	],
	controllers: [
		AuthController, // Основний контролер для авторизації (логін, реєстрація, токени)
		SocialMediaAuthController, // Контролер для авторизації через соцмережі (Google, GitHub, Apple, Telegram)
	],
	providers: [
		JwtStrategy, // Стратегія для перевірки JWT токенів
		PrismaService, // Сервіс для роботи з базою даних через Prisma
		AuthService, // Основний сервіс авторизації (логіка логіну, реєстрації, токенів)
		RefreshTokenService, // Сервіс для роботи з refresh токенами (запис/видалення у куки)
		GoogleStrategy, // Стратегія авторизації через Google OAuth
		GithubStrategy, // Стратегія авторизації через GitHub OAuth
		SocialMediaAuthService, // Сервіс для логіки авторизації через соцмережі
	],
})
export class AuthModule {} // Модуль авторизації, який об'єднує всі сервіси, контролери та стратегії

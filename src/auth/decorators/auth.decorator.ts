import { applyDecorators, UseGuards } from '@nestjs/common' // Імпорт утиліти для комбінування декораторів та декоратора для підключення guard'ів
import { Role } from '@prisma/client' // Імпорт enum ролей користувача з Prisma-схеми
import { JwtAuthGuard } from '../guards/jwt.guard' // Guard для перевірки JWT-токена (автентифікація)
import { RolesGuard } from '../guards/roles.guard' // Guard для перевірки ролей користувача (авторизація)
import { Roles } from './roles.decorator' // Декоратор для передачі ролей у RolesGuard

/**
 * Декоратор Auth використовується для захисту маршрутів.
 * Додає перевірку JWT (автентифікація) та перевірку ролей (авторизація).
 *
 * @param roles - Одна або декілька ролей (Role або Role[]), яким дозволено доступ до маршруту.
 *                Якщо не вказано, доступ мають всі ролі (USER, ADMIN, MANAGER, PREMIUM).
 * @returns Комбінований декоратор, який підключає Roles та необхідні Guard-и.
 */
export const Auth = (roles?: Role | Role[]) => {
	// Якщо ролі не вказані — дозволяємо всі основні ролі
	if (!roles) roles = [Role.USER, Role.ADMIN, Role.MANAGER, Role.PREMIUM]
	// Якщо передано одну роль — обгортаємо у масив для уніфікації
	if (!Array.isArray(roles)) roles = [roles]
	// Комбінуємо декоратор ролей та Guard-и для автентифікації й авторизації
	return applyDecorators(
		Roles(...roles), // Додає метадані про ролі для подальшої перевірки
		UseGuards(JwtAuthGuard, RolesGuard) // Підключає Guard-и: спочатку JWT, потім ролі
	)
}

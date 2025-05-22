import {
	CanActivate, // Інтерфейс для створення guard-ів, які вирішують, чи дозволяти доступ до маршруту
	ExecutionContext, // Контекст виконання, містить інформацію про поточний запит
	ForbiddenException, // Виняток, який кидається при відсутності прав доступу
	Injectable, // Декоратор для можливості інжекції залежностей
} from '@nestjs/common'
import { Reflector } from '@nestjs/core' // Сервіс для читання метаданих (наприклад, ролей)
import { Role, User } from '@prisma/client' // Імпорт enum ролей та типу користувача з Prisma
import { Request } from 'express' // Типізація HTTP-запиту

@Injectable() // Декоратор, що дозволяє інжекцію цього guard-а через DI контейнер NestJS
export class RolesGuard implements CanActivate {
	// Guard для перевірки ролей користувача
	constructor(private reflector: Reflector) {} // Інжекція Reflector для читання метаданих

	/**
	 * Основний метод guard-а, який вирішує, чи дозволяти доступ до маршруту.
	 * @param context - ExecutionContext, містить інформацію про поточний запит та handler
	 * @returns true, якщо користувач має одну з дозволених ролей, інакше кидає ForbiddenException
	 */
	canActivate(context: ExecutionContext): boolean {
		// Отримуємо масив дозволених ролей з метаданих, встановлених декоратором @Roles
		const roles = this.reflector.get<Role[]>('roles', context.getHandler())
		if (!roles) {
			// Якщо ролі не вказані — доступ дозволено всім авторизованим користувачам
			return true
		}

		// Отримуємо HTTP-запит з контексту
		const request = context.switchToHttp().getRequest<Request>()
		// Витягуємо користувача з request (додається після проходження JwtAuthGuard)
		const user = request.user as User

		// Перевіряємо, чи має користувач хоча б одну з дозволених ролей
		const hasRole = () => user.rights.some(role => roles.includes(role))
		if (!hasRole()) {
			// Якщо жодної ролі немає — кидаємо виняток "Доступ заборонено"
			throw new ForbiddenException('You shall not pass!')
		}

		// Якщо перевірка пройдена — дозволяємо доступ
		return true
	}
}

import { SetMetadata } from '@nestjs/common' // Імпорт функції для встановлення метаданих на рівні маршруту/методу/класу
import { Role } from '@prisma/client' // Імпорт enum ролей користувача з Prisma-схеми

/**
 * Декоратор Roles використовується для передачі дозволених ролей у Guard авторизації.
 *
 * @param roles - Список ролей (типу Role), яким дозволено доступ до маршруту.
 *                Приймає будь-яку кількість аргументів (rest-параметр).
 * @returns Декоратор, який встановлює метадані 'roles' для подальшої перевірки у RolesGuard.
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles) // Встановлює масив ролей у метадані з ключем 'roles'

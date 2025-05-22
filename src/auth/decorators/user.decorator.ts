import { createParamDecorator, ExecutionContext } from '@nestjs/common' // Імпорт функції для створення власного декоратора параметра та типу контексту виконання
import prisma from '@prisma/client' // Імпорт всього модуля Prisma Client (для доступу до типів, зокрема User)

/**
 * Декоратор CurrentUser дозволяє отримати поточного авторизованого користувача з request.
 * Може повертати як весь об'єкт користувача, так і конкретне його поле.
 *
 * @param data - (необов'язковий) ключ поля користувача (keyof prisma.User), яке потрібно повернути.
 * @param ctx - ExecutionContext NestJS, що містить інформацію про поточний запит.
 * @returns Якщо data не вказано — повертає весь об'єкт user, інакше повертає конкретне поле user[data].
 */
export const CurrentUser = createParamDecorator(
	(data: keyof prisma.User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest() // Отримуємо HTTP-запит з контексту виконання
		const user = request.user // Витягуємо об'єкт користувача, який додається guard'ом після автентифікації

		return data ? user[data] : user // Якщо data задано — повертаємо відповідне поле, інакше весь об'єкт user
	}
)

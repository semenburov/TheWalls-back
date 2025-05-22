import { Injectable } from '@nestjs/common' // Декоратор для можливості інжекції через DI контейнер NestJS
import { ConfigService } from '@nestjs/config' // Сервіс для доступу до змінних оточення (env)
import { PassportStrategy } from '@nestjs/passport' // Базовий клас для створення стратегій Passport
import { ExtractJwt, Strategy } from 'passport-jwt' // JWT-стратегія та утиліта для витягання токена з запиту
import { UserService } from '../../user/user.service' // Сервіс для роботи з користувачами (БД)

@Injectable() // Декоратор, що дозволяє інжекцію цього класу через DI контейнер NestJS
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService, // Інжекція сервісу конфігурації для доступу до секрету
		private userService: UserService // Інжекція сервісу користувачів для пошуку користувача по id
	) {
		// Викликаємо конструктор базового класу PassportStrategy з налаштуваннями JWT
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Витягуємо JWT з Authorization: Bearer <token>
			ignoreExpiration: true, // Не ігноруємо закінчення терміну дії токена (false = перевіряємо)
			secretOrKey: configService.get('JWT_SECRET'), // Секретний ключ для перевірки підпису токена
		})
	}

	/**
	 * Метод валідації, який викликається після успішного декодування JWT.
	 * Тут можна додатково перевірити користувача або підвантажити його з БД.
	 *
	 * @param payload - Об'єкт, який містить дані з токена (у цьому випадку { id: string })
	 * @returns Об'єкт користувача, який буде додано до request.user
	 */
	async validate({ id }: { id: string }) {
		return this.userService.getById(id) // Повертаємо користувача з БД за id (або null, якщо не знайдено)
	}
}

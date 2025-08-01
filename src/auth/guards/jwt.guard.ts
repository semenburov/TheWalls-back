import { AuthGuard } from '@nestjs/passport' // Імпорт базового Guard-а для автентифікації через стратегії Passport

/**
 * JwtAuthGuard — Guard для захисту маршрутів за допомогою JWT-автентифікації.
 * Наслідується від AuthGuard з параметром 'jwt', що вказує на використання JWT-стратегії.
 * 
 * Використовується для перевірки наявності та валідності JWT-токена у запиті.
 * Якщо токен валідний — у request додається об'єкт user.
 */
export class JwtAuthGuard extends AuthGuard('jwt') {} // Наслідування без додаткової логіки, вся поведінка у базовому класі

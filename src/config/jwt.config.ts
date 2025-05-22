import { ConfigService } from '@nestjs/config' // Сервіс для доступу до змінних оточення (env)
import { JwtModuleOptions } from '@nestjs/jwt' // Тип для опцій модуля JWT

/**
 * Асинхронна фабрика для конфігурації JWT модуля.
 * Використовується для підключення JWT у різних середовищах.
 *
 * @param configService - Сервіс для доступу до змінних оточення (env)
 * @returns Promise з об'єктом налаштувань JwtModuleOptions
 */
export const getJwtConfig = async (
	configService: ConfigService // Інжектований сервіс конфігурації
): Promise<JwtModuleOptions> => ({
	secret: configService.get('JWT_SECRET'), // Секретний ключ для підпису та перевірки JWT (з env)
})

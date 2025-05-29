import { IsEmail, IsString, MinLength } from 'class-validator' // Імпорт декораторів для валідації полів DTO

/**
 * DTO (Data Transfer Object) для авторизації/реєстрації користувача.
 * Містить поля, які очікуються у тілі запиту при логіні або реєстрації.
 */
export class AuthDto {
	@IsEmail() // Перевіряє, що значення є валідною email-адресою
	email: string // Email користувача (обов'язковий)

	@MinLength(6, {
		message: 'Password must be at least 6 characters long', // Кастомне повідомлення про помилку
	})
	@IsString() // Перевіряє, що значення є рядком
	password: string // Пароль користувача (обов'язковий, мінімум 6 символів)

	@IsString() // можна додати додаткову валідацію по довжині/формату, якщо потрібно
	recaptchaToken: string
}

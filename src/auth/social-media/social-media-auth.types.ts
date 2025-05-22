import { User } from '@prisma/client' // Імпорт типу користувача з Prisma (відповідає структурі таблиці users)

/**
 * Опис структури профілю користувача, який повертає Google OAuth.
 */
export interface IGoogleProfile {
	id: string // Унікальний ідентифікатор користувача Google
	displayName: string // Відображуване ім'я користувача
	name: {
		familyName: string // Прізвище
		givenName: string // Ім'я
	}
	emails: Array<{
		value: string // Email користувача
		verified: boolean // Чи підтверджено email
	}>
	photos: Array<{
		value: string // URL аватарки
	}>
}

/**
 * Опис структури профілю користувача, який повертає GitHub OAuth.
 */
export interface IGithubProfile {
	id: string // Унікальний ідентифікатор користувача GitHub
	nodeId: string // Node ID користувача (GitHub internal)
	displayName: string | null // Відображуване ім'я (може бути null)
	username: string // Username користувача на GitHub
	profileUrl: string // Посилання на профіль GitHub
	photos: Array<{
		value: string // URL аватарки
	}>
	emails: Array<{
		value: string // Email користувача
	}>
}

/**
 * Опис структури профілю користувача, який повертає Apple OAuth.
 */
export interface IAppleProfile {
	email: string // Email користувача Apple
	firstName?: string // Ім'я (може бути відсутнє)
	lastName?: string // Прізвище (може бути відсутнє)
	accessToken: string // Access token, виданий Apple
}

/**
 * Опис структури профілю користувача, який повертає Telegram.
 */
export interface ITelegramProfile {
	telegramId: string // Унікальний ідентифікатор користувача Telegram
	username?: string // Username у Telegram (може бути відсутній)
	firstName: string // Ім'я користувача
	lastName?: string // Прізвище (може бути відсутнє)
	photoUrl?: string // URL аватарки (може бути відсутній)
	authDate: number // Час авторизації (UNIX timestamp)
	hash: string // Підпис (hash) для перевірки достовірності даних
}

/**
 * Тип користувача, який використовується для авторизації через соцмережі.
 * Містить лише ті поля, які можуть бути отримані з соцмережі.
 * Partial робить всі поля необов'язковими.
 */
export type TUserSocial = Partial<
	Pick<User, 'email' | 'name' | 'avatarPath' | 'phone' | 'telegramId'>
>

/**
 * Тип функції callback, яку викликає стратегія соцмережі після авторизації.
 * @param error - Помилка, якщо виникла
 * @param user - Об'єкт користувача (TUserSocial)
 * @param info - Додаткова інформація (опціонально)
 */
export type TSocialCallback = (
	error: any,
	user: TUserSocial,
	info?: any
) => void

import { Auth } from '@/auth/decorators/auth.decorator' // Декоратор для захисту маршрутів (автентифікація + авторизація)
import { CurrentUser } from '@/auth/decorators/user.decorator' // Декоратор для отримання поточного користувача з request
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Patch,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Role } from '@prisma/client' // Enum ролей користувача з Prisma
import { UserService } from './user.service' // Сервіс для роботи з користувачами (БД)

@Controller('users') // Префікс для всіх маршрутів цього контролера: /users
export class UserController {
	constructor(private readonly userService: UserService) {} // Інжекція сервісу користувачів

	@Auth() // Доступ лише для авторизованих користувачів (будь-яка роль)
	@Get('profile') // GET /users/profile
	async getProfile(@CurrentUser('id') id: string) {
		// Повертає профіль поточного користувача за його id
		return this.userService.getById(id)
	}

	@UsePipes(new ValidationPipe()) // Валідація вхідних даних через DTO/об'єкт
	@HttpCode(200) // Встановлюємо HTTP статус 200 для відповіді
	@Auth() // Доступ лише для авторизованих користувачів
	@Patch('update-email') // PATCH /users/update-email
	async updateEmail(
		@CurrentUser('id') userId: string, // id поточного користувача з JWT
		@Body() dto: { email: string } // Новий email з тіла запиту
	) {
		// Оновлює email користувача
		return this.userService.update(userId, { email: dto.email })
	}

	@Auth(Role.PREMIUM) // Доступ лише для користувачів з роллю PREMIUM
	@Get('premium') // GET /users/premium
	async getPremium() {
		// Повертає контент для преміум-користувачів
		return { text: 'Premium content' }
	}

	@Auth([Role.ADMIN, Role.MANAGER]) // Доступ для ролей ADMIN та MANAGER
	@Get('manager') // GET /users/manager
	async getManagerContent() {
		// Повертає контент для менеджерів та адміністраторів
		return { text: 'Manager content' }
	}

	@Auth(Role.ADMIN) // Доступ лише для адміністраторів
	@Get('list') // GET /users/list
	async getList() {
		// Повертає список усіх користувачів (тільки для ADMIN)
		return this.userService.getUsers()
	}
}

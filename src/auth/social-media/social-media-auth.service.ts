import { TUserSocial } from '@/auth/social-media/social-media-auth.types' // Тип користувача, отриманого з соцмережі
import { UserService } from '@/user/user.service' // Сервіс для роботи з користувачами (БД)
import { BadRequestException, Injectable } from '@nestjs/common' // Декоратор для DI та виняток для помилок

@Injectable() // Декоратор, що дозволяє інжекцію цього сервісу через DI контейнер NestJS
export class SocialMediaAuthService {
    constructor(private userService: UserService) {} // Інжекція сервісу користувачів

    /**
     * Логін або реєстрація користувача через соціальну мережу.
     * Якщо користувача з такими даними ще немає — створює нового.
     * 
     * @param req - Об'єкт, що містить користувача з соцмережі (user: TUserSocial)
     * @returns Об'єкт користувача з БД (створений або знайдений)
     * @throws BadRequestException, якщо користувач не переданий у req
     */
    async login(req: { user: TUserSocial }) {
        if (!req.user) {
            // Якщо користувач не переданий — кидаємо помилку
            throw new BadRequestException('User not found by social media')
        }

        // Знаходимо або створюємо користувача у БД за даними з соцмережі
        return this.userService.findOrCreateSocialUser(req.user)
    }
}

import VerificationEmail from '@email/confirmation.email' // React-компонент для шаблону листа підтвердження email
import { MailerService } from '@nestjs-modules/mailer' // Сервіс для відправки email через SMTP
import { Injectable } from '@nestjs/common' // Декоратор для DI
import { render } from '@react-email/render' // Функція для рендеру React email-компонентів у HTML

@Injectable() // Декоратор, що дозволяє інжекцію цього сервісу через DI контейнер NestJS
export class EmailService {
	constructor(private readonly mailerService: MailerService) {} // Інжекція сервісу для відправки email

	/**
	 * Відправляє email на вказану адресу.
	 * @param to - Email отримувача
	 * @param subject - Тема листа
	 * @param html - HTML-контент листа
	 * @returns Promise з результатом відправки
	 */
	sendEmail(to: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to, // Кому
			subject, // Тема листа
			html, // HTML-контент листа
		})
	}

	/**
	 * Відправляє лист для підтвердження email користувача.
	 * @param to - Email отримувача
	 * @param verificationLink - Посилання для підтвердження email
	 * @returns Promise з результатом відправки
	 */
	async sendVerification(to: string, verificationLink: string) {
		const html = await render(VerificationEmail({ url: verificationLink })) // Рендеримо HTML з React-компонента
		return this.sendEmail(to, 'Подтверждение почты', html) // Відправляємо лист з темою та HTML
	}
}

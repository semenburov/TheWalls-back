import { RequestMethod } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api', {
		exclude: [
			{ path: 'auth/google', method: RequestMethod.GET },
			{ path: 'auth/google/redirect', method: RequestMethod.GET },
			{ path: 'auth/github', method: RequestMethod.GET },
			{ path: 'auth/github/redirect', method: RequestMethod.GET },
			{ path: 'auth/twitch', method: RequestMethod.GET },
			{ path: 'auth/twitch/redirect', method: RequestMethod.GET },
			{ path: 'auth/yandex', method: RequestMethod.GET },
			{ path: 'auth/yandex/redirect', method: RequestMethod.GET },
			{ path: 'auth/telegram/redirect', method: RequestMethod.GET },
			{ path: 'verify-email', method: RequestMethod.GET }
		]
	})

	app.use(cookieParser())
	app.enableCors({
		origin: [
			'http://localhost:3000',
			'https://e61b-106-249-226-194.ngrok-free.app'
		],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await app.listen(4200)
}
bootstrap()

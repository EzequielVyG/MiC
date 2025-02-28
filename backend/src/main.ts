import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDemon } from './cron/backup_minio';
// import { createDemon } from './cron/backup_minio'

require('dotenv').config();

async function bootstrap() {

	const app = await NestFactory.create(AppModule);

	const corsOptions: CorsOptions = {
		origin: process.env.ACCEPTED_URLS ? JSON.parse(process.env.ACCEPTED_URLS) : [],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type,Authorization',
		exposedHeaders: 'Access-Control-Allow-Origin',
		credentials: true,
	};
	app.enableCors(corsOptions);

	await app.listen(process.env.PORT, () => {
	});

}
bootstrap();

if (process.env.MAKE_BACKUPS === 'true') {
	const job = createDemon();
	job.start();
}



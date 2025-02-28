import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from '../typeorm.config';

import { Faq } from './infrastructure/faq/typeorm/model/faq.entity';
import { User } from './infrastructure/user/typeorm/model/user.entity';
import { UserModule } from './modules/user.module';

import { Category } from './infrastructure/category/typeorm/model/category.entity';
import { Place } from './infrastructure/place/typeorm/model/place.entity';
import { CategoryModule } from './modules/category.module';
import { FaqModule } from './modules/faq.module';
import { PlaceModule } from './modules/place.module';

import { Circuit } from './infrastructure/circuit/typeorm/model/circuit.entity';
import { Organization } from './infrastructure/organization/typeorm/model/organization.entity';
import { AccesibilityModule } from './modules/accesibility.module';
import { CircuitModule } from './modules/circuit.module';
import { OrganizationModule } from './modules/organization.module';
import { ServiceModule } from './modules/service.module';
import { TranslatorModule } from './modules/translator.module';
import { Event } from './infrastructure/event/typeorm/model/event.entity';
import { EventModule } from './modules/event.module';
import { Notification } from './infrastructure/notification/typeorm/model/notification.entity';
import { NotificationModule } from './modules/notification.module';
import { MinioClientModule } from './minio-client/minio-client.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forFeature([User]),
		UserModule,
		TypeOrmModule.forFeature([Category]),
		CategoryModule,
		PlaceModule,
		ServiceModule,
		AccesibilityModule,
		TranslatorModule,
		TypeOrmModule.forFeature([Place]),
		TypeOrmModule.forFeature([Organization]),
		OrganizationModule,
		TypeOrmModule.forFeature([Faq]),
		FaqModule,
		TypeOrmModule.forFeature([Circuit]),
		CircuitModule,
		TypeOrmModule.forFeature([Event]),
		EventModule,
		TypeOrmModule.forFeature([Notification]),
		NotificationModule,
		MinioClientModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }

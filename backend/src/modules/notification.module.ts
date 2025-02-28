import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IOrchestratorRepository } from 'src/domain/notification/port/iOrchestratorRepository';
import { INotificationRepository } from 'src/domain/notification/port/iNotificationRepository';
import { Notification } from 'src/infrastructure/notification/typeorm/model/notification.entity';
import { NotificationController } from 'src/infrastructure/notification/rest/controller/notification.controller';
import { NotificationRepository } from 'src/infrastructure/notification/typeorm/repository/notification.respository';
import { FindAllNotifications } from 'src/domain/notification/case/findAllNotifications.case';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { OrchestratorRepository } from 'src/infrastructure/notification/orchestrator/orchestrator';
// import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
// import { OrganizationRepository } from 'src/infrastructure/organization/typeorm/repository/organization.repository';
import { IDocumentRepository } from 'src/domain/organization/port/IDocumentRepository';
import { DocumentRepository } from 'src/infrastructure/organization/typeorm/repository/document.repository';
// import { Organization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { Document } from 'src/infrastructure/organization/typeorm/model/document.entity';
import { FindNotificationsByUser } from 'src/domain/notification/case/findByUser';
import { User } from 'src/infrastructure/user/typeorm/model/user.entity';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { UserRepository } from 'src/infrastructure/user/typeorm/repository/user.repository';
import { ReadNotification } from 'src/domain/notification/case/readNotification.case';

import { IUserTokenRepository } from 'src/domain/user/port/iUserTokenRepository';
import { UserTokenRepository } from 'src/infrastructure/user/typeorm/repository/userToken.repository';
import { UserToken } from 'src/infrastructure/user/typeorm/model/userToken.entity';

import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { UserPreference } from 'src/infrastructure/user/typeorm/model/user-preference.entity';
import { UserAccount } from 'src/infrastructure/user/typeorm/model/userAccount.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Notification]),
		TypeOrmModule.forFeature([Document]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([UserToken]),
		TypeOrmModule.forFeature([UserPreference]),
		TypeOrmModule.forFeature([UserAccount]),
		MinioClientModule,
	],
	controllers: [NotificationController],
	providers: [
		FindAllNotifications,
		CreateNotification,
		FindNotificationsByUser,
		ReadNotification,
		{
			provide: INotificationRepository,
			useClass: NotificationRepository,
		},
		{
			provide: IOrchestratorRepository,
			useClass: OrchestratorRepository,
		},
		{
			provide: IDocumentRepository,
			useClass: DocumentRepository,
		},
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
		{
			provide: IUserTokenRepository,
			useClass: UserTokenRepository,
		},
	],
})
export class NotificationModule { }

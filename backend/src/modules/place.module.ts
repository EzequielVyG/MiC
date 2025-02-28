import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICategoryRepository } from 'src/domain/category/port/iCategoryRepository';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { INotificationRepository } from 'src/domain/notification/port/iNotificationRepository';
import { IOrchestratorRepository } from 'src/domain/notification/port/iOrchestratorRepository';
import { IDocumentRepository } from 'src/domain/organization/port/IDocumentRepository';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
import { CreatePhoto } from 'src/domain/place/case/createPhoto.case';
import { CreatePlace } from 'src/domain/place/case/createPlace.case';
import { DeletePlace } from 'src/domain/place/case/deletePlace.case';
import { FindByCategories } from 'src/domain/place/case/findByCategories';
import { FindByCategory } from 'src/domain/place/case/findByCategory.case';
import { FindByDistance } from 'src/domain/place/case/findByDistance.case';
import { FindByOrganization } from 'src/domain/place/case/findByOrganization';
import { FindPlaces } from 'src/domain/place/case/findPlaces.case';
import { UpdatePlace } from 'src/domain/place/case/updatePlace.case';
import { IPhotoRepository } from 'src/domain/place/port/iPhotoRepository';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { CategoryRepository } from 'src/infrastructure/category/typeorm/repository/category.repository';
import { OrchestratorRepository } from 'src/infrastructure/notification/orchestrator/orchestrator';
import { Notification } from 'src/infrastructure/notification/typeorm/model/notification.entity';
import { NotificationRepository } from 'src/infrastructure/notification/typeorm/repository/notification.respository';
import { Document } from 'src/infrastructure/organization/typeorm/model/document.entity';
import { Organization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { DocumentRepository } from 'src/infrastructure/organization/typeorm/repository/document.repository';
import { OrganizationRepository } from 'src/infrastructure/organization/typeorm/repository/organization.repository';
import { PlaceController } from 'src/infrastructure/place/rest/controller/place.controller';
import { Accessibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';
import { DayOfWeek } from 'src/infrastructure/place/typeorm/model/day-of-week.entity';
import { PlacePhoto } from 'src/infrastructure/place/typeorm/model/place-photo.entity';
import { PlaceSchedule } from 'src/infrastructure/place/typeorm/model/place-schedule.entity';
import { Place } from 'src/infrastructure/place/typeorm/model/place.entity';
import { Service } from 'src/infrastructure/place/typeorm/model/service.entity';
import { PhotoRepository } from 'src/infrastructure/place/typeorm/repository/photo.repository';
import { PlaceRepository } from 'src/infrastructure/place/typeorm/repository/place.repository';
import { UserPreference } from 'src/infrastructure/user/typeorm/model/user-preference.entity';
import { User } from 'src/infrastructure/user/typeorm/model/user.entity';
import { UserRepository } from 'src/infrastructure/user/typeorm/repository/user.repository';
import { UserToken } from 'src/infrastructure/user/typeorm/model/userToken.entity';

import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { IUserTokenRepository } from 'src/domain/user/port/iUserTokenRepository';
import { UserTokenRepository } from 'src/infrastructure/user/typeorm/repository/userToken.repository';
import { IUserAccountRepository } from 'src/domain/user/port/iUserAccountRepository';
import { UserAccountRepository } from 'src/infrastructure/user/typeorm/repository/userAccount.repository';
import { UserAccount } from 'src/infrastructure/user/typeorm/model/userAccount.entity';
import { IOperatorRepository } from 'src/domain/organization/port/iOperatorRepository';
import { OperatorRepository } from 'src/infrastructure/organization/typeorm/repository/operator.repository';
import { OrganizationUser } from 'src/infrastructure/organization/typeorm/model/organization-user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Place]),
		TypeOrmModule.forFeature([PlacePhoto]),
		TypeOrmModule.forFeature([PlaceSchedule]),
		TypeOrmModule.forFeature([DayOfWeek]),
		TypeOrmModule.forFeature([Category]),
		TypeOrmModule.forFeature([Accessibility]),
		TypeOrmModule.forFeature([Service]),
		TypeOrmModule.forFeature([Organization]),
		TypeOrmModule.forFeature([Document]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([UserPreference]),
		TypeOrmModule.forFeature([Notification]),
		TypeOrmModule.forFeature([UserToken]),
		TypeOrmModule.forFeature([UserAccount]),
		TypeOrmModule.forFeature([OrganizationUser]),
		MinioClientModule
	],
	controllers: [PlaceController],
	providers: [
		FindPlaces,
		CreatePlace,
		DeletePlace,
		UpdatePlace,
		CreatePhoto,
		FindByDistance,
		FindByCategory,
		FindByOrganization,
		FindByCategories,
		CreateNotification,
		{
			provide: IPlaceRepository,
			useClass: PlaceRepository,
		},
		{
			provide: IPhotoRepository,
			useClass: PhotoRepository,
		},
		{
			provide: ICategoryRepository,
			useClass: CategoryRepository,
		},
		{
			provide: IOrganizationRepository,
			useClass: OrganizationRepository,
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
			provide: IOrchestratorRepository,
			useClass: OrchestratorRepository,
		},
		{
			provide: INotificationRepository,
			useClass: NotificationRepository,
		},
		{
			provide: IUserTokenRepository,
			useClass: UserTokenRepository,
		},
		{
			provide: IUserAccountRepository,
			useClass: UserAccountRepository,
		},
		{
			provide: IOperatorRepository,
			useClass: OperatorRepository,
		},
	],
})
export class PlaceModule { }

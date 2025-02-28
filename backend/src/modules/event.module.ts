import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionEventInMyPlace } from 'src/domain/event/case/actionEventInMyPlace.case';
import { ActionEventOrganization } from 'src/domain/event/case/actionEventOrganization.case';
import { CreateEvent } from 'src/domain/event/case/createEvent.case';
import { DeleteEvent } from 'src/domain/event/case/deleteEvent.case';
import { FindEventByCategory } from 'src/domain/event/case/findByCategory';
import { FindEventById } from 'src/domain/event/case/findByID.case';
import { FindByStatus } from 'src/domain/event/case/findByStatus.case';
import { FindEventsByFilters } from 'src/domain/event/case/findByUser.case';
import { FindFirst15VigentEvents } from 'src/domain/event/case/findFirst15VigentEvents';
import { FindVigentByPlace } from 'src/domain/event/case/findVigenteByPlace';
import { UpdateEvent } from 'src/domain/event/case/updateEvent.case';
import { IParticipantRepository } from 'src/domain/event/port/iParticipantRepository';
import { IPhotoRepository } from 'src/domain/event/port/iPhotoRepository';
import { IFlyerRepository } from 'src/domain/event/port/iFlyerRepository';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { INotificationRepository } from 'src/domain/notification/port/iNotificationRepository';
import { IOrchestratorRepository } from 'src/domain/notification/port/iOrchestratorRepository';
import { FindByIntegranteEmailOrganization } from 'src/domain/organization/case/findByIntegranteEmailOrganization';
import { IDocumentRepository } from 'src/domain/organization/port/IDocumentRepository';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { IUserTokenRepository } from 'src/domain/user/port/iUserTokenRepository';
import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { EventParticipant } from 'src/infrastructure/event/typeorm/model/event-participant.entity';
import { EventPhoto } from 'src/infrastructure/event/typeorm/model/event-photo.entity';
import { EventFlyer } from 'src/infrastructure/event/typeorm/model/event-flyer.entity';
import { ParticipantRepository } from 'src/infrastructure/event/typeorm/repository/participant.repository';
import { PhotoRepository } from 'src/infrastructure/event/typeorm/repository/photo.repository';
import { FlyerRepository } from 'src/infrastructure/event/typeorm/repository/flyer.repository';
import { OrchestratorRepository } from 'src/infrastructure/notification/orchestrator/orchestrator';
import { Notification } from 'src/infrastructure/notification/typeorm/model/notification.entity';
import { NotificationRepository } from 'src/infrastructure/notification/typeorm/repository/notification.respository';
import { Document } from 'src/infrastructure/organization/typeorm/model/document.entity';
import { Organization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { DocumentRepository } from 'src/infrastructure/organization/typeorm/repository/document.repository';
import { OrganizationRepository } from 'src/infrastructure/organization/typeorm/repository/organization.repository';
import { Accessibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';
import { DayOfWeek } from 'src/infrastructure/place/typeorm/model/day-of-week.entity';
import { PlacePhoto } from 'src/infrastructure/place/typeorm/model/place-photo.entity';
import { PlaceSchedule } from 'src/infrastructure/place/typeorm/model/place-schedule.entity';
import { Place } from 'src/infrastructure/place/typeorm/model/place.entity';
import { Service } from 'src/infrastructure/place/typeorm/model/service.entity';
import { PlaceRepository } from 'src/infrastructure/place/typeorm/repository/place.repository';
import { User } from 'src/infrastructure/user/typeorm/model/user.entity';
import { UserToken } from 'src/infrastructure/user/typeorm/model/userToken.entity';
import { UserRepository } from 'src/infrastructure/user/typeorm/repository/user.repository';
import { UserTokenRepository } from 'src/infrastructure/user/typeorm/repository/userToken.repository';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FindAllEvents } from '../domain/event/case/findAllEvents.case';
import { IEventRepository } from '../domain/event/port/iEventRepository';
import { EventController } from '../infrastructure/event/rest/controller/event.controller';
import { Event } from '../infrastructure/event/typeorm/model/event.entity';
import { EventRepository } from '../infrastructure/event/typeorm/repository/event.repository';
import { UserPreference } from 'src/infrastructure/user/typeorm/model/user-preference.entity';
import { FindEventByCategories } from 'src/domain/event/case/findByCategories';
import { FindOperator } from 'src/domain/organization/case/findOperator.case';
import { IOperatorRepository } from 'src/domain/organization/port/iOperatorRepository';
import { OperatorRepository } from 'src/infrastructure/organization/typeorm/repository/operator.repository';
import { OrganizationUser } from 'src/infrastructure/organization/typeorm/model/organization-user.entity';
import { UserAccount } from 'src/infrastructure/user/typeorm/model/userAccount.entity';
import { FindVigents } from 'src/domain/event/case/findVigents.case';
import { FindEventsWithinOneDay } from 'src/domain/event/case/findEventsWithinOneDay';
import { EventNotificationService } from 'src/cron/eventNotificationService';

@Module({
	imports: [
		TypeOrmModule.forFeature([Event]),
		TypeOrmModule.forFeature([Place]),
		TypeOrmModule.forFeature([Category]),
		TypeOrmModule.forFeature([PlaceSchedule]),
		TypeOrmModule.forFeature([DayOfWeek]),
		TypeOrmModule.forFeature([PlacePhoto]),
		TypeOrmModule.forFeature([Accessibility]),
		TypeOrmModule.forFeature([Service]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([EventPhoto]),
		TypeOrmModule.forFeature([EventFlyer]),
		TypeOrmModule.forFeature([Organization]),
		TypeOrmModule.forFeature([Document]),
		TypeOrmModule.forFeature([EventParticipant]),
		TypeOrmModule.forFeature([Notification]),
		TypeOrmModule.forFeature([UserToken]),
		TypeOrmModule.forFeature([UserPreference]),
		TypeOrmModule.forFeature([OrganizationUser]),
		TypeOrmModule.forFeature([UserAccount]),
		MinioClientModule,
	],
	controllers: [EventController],
	providers: [
		FindAllEvents,
		FindEventById,
		FindEventsByFilters,
		FindVigentByPlace,
		FindFirst15VigentEvents,
		CreateEvent,
		DeleteEvent,
		FindByStatus,
		UpdateEvent,
		FindEventByCategory,
		CreateNotification,
		ActionEventInMyPlace,
		FindByIntegranteEmailOrganization,
		ActionEventOrganization,
		ParticipantRepository,
		FindEventByCategories,
		FindOperator,
		FindVigents,
		FindEventsWithinOneDay,
		EventNotificationService,
		EventRepository,
		UserRepository,
		CreateNotification,
		{
			provide: IEventRepository,
			useClass: EventRepository,
		},
		{
			provide: IPlaceRepository,
			useClass: PlaceRepository,
		},
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
		{
			provide: IPhotoRepository,
			useClass: PhotoRepository,
		},
		{
			provide: IFlyerRepository,
			useClass: FlyerRepository,
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
			provide: IParticipantRepository,
			useClass: ParticipantRepository,
		},
		{
			provide: IOperatorRepository,
			useClass: OperatorRepository,
		},
	],
})
export class EventModule { }

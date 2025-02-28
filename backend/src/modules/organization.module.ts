import { Module } from '@nestjs/common';
import { OrganizationController } from '../infrastructure/organization/rest/controller/organization.controller';
import { IOrganizationRepository } from '../domain/organization/port/iOrganizationRepository';
import { OrganizationRepository } from '../infrastructure/organization/typeorm/repository/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../infrastructure/organization/typeorm/model/organization.entity';
import { Document } from 'src/infrastructure/organization/typeorm/model/document.entity';
import { IDocumentRepository } from 'src/domain/organization/port/IDocumentRepository';
import { DocumentRepository } from 'src/infrastructure/organization/typeorm/repository/document.repository';

import { CreateOrganization } from 'src/domain/organization/case/createOrganization.case';
import { UpdateOrganization } from 'src/domain/organization/case/updateOrganization.case';
import { UpdateTakeOrganization } from 'src/domain/organization/case/updateTakeOrgranization.case';
import { UpdateDropOrganization } from 'src/domain/organization/case/updateDropOrgranization.case';
import { UpdateStatusOrganization } from 'src/domain/organization/case/updateStatusOrgranization.case';
import { Notification } from 'src/infrastructure/notification/typeorm/model/notification.entity';
import { FindByIdOrganization } from 'src/domain/organization/case/findByIdOrganizations.case';
import { FindAllOrganization } from 'src/domain/organization/case/findAllOrganizations.case';
import { CreateDocument } from 'src/domain/organization/case/createDocument.case';
import { FindByOwnerOrganization } from 'src/domain/organization/case/findByOwnerOrganization.case';
import { FindByOperatorOrganization } from 'src/domain/organization/case/findByOperatorOrganization.case';
import { DeleteOrganization } from 'src/domain/organization/case/deleteOrganization.case';
import { FindByIntegranteEmailOrganization } from 'src/domain/organization/case/findByIntegranteEmailOrganization';
import { FindByStatusOrganization } from 'src/domain/organization/case/findByStatusOrganizations.case';
import { UserRepository } from 'src/infrastructure/user/typeorm/repository/user.repository';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { User } from 'src/infrastructure/user/typeorm/model/user.entity';
import { OrganizationUser } from 'src/infrastructure/organization/typeorm/model/organization-user.entity';
import { OperatorRepository } from 'src/infrastructure/organization/typeorm/repository/operator.repository';
import { IOperatorRepository } from 'src/domain/organization/port/iOperatorRepository';

import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { INotificationRepository } from 'src/domain/notification/port/iNotificationRepository';
import { IOrchestratorRepository } from 'src/domain/notification/port/iOrchestratorRepository';
import { NotificationRepository } from 'src/infrastructure/notification/typeorm/repository/notification.respository';
import { OrchestratorRepository } from 'src/infrastructure/notification/orchestrator/orchestrator';
import { UserToken } from 'src/infrastructure/user/typeorm/model/userToken.entity';
import { IUserTokenRepository } from 'src/domain/user/port/iUserTokenRepository';
import { UserTokenRepository } from 'src/infrastructure/user/typeorm/repository/userToken.repository';
import { UserPreference } from 'src/infrastructure/user/typeorm/model/user-preference.entity';
import { FindOperator } from 'src/domain/organization/case/findOperator.case';
import { UpdateOperator } from 'src/domain/organization/case/updateOperator.case';
import { UserAccount } from 'src/infrastructure/user/typeorm/model/userAccount.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Organization]),
		TypeOrmModule.forFeature([Document]),
		TypeOrmModule.forFeature([OrganizationUser]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Notification]),
		TypeOrmModule.forFeature([UserToken]),
		TypeOrmModule.forFeature([UserPreference]),
		MinioClientModule,
		TypeOrmModule.forFeature([UserAccount]),
	],
	controllers: [OrganizationController],
	providers: [
		CreateOrganization,
		UpdateOrganization,
		UpdateTakeOrganization,
		UpdateDropOrganization,
		UpdateStatusOrganization,
		FindByIdOrganization,
		FindAllOrganization,
		FindByOwnerOrganization,
		FindByOperatorOrganization,
		CreateDocument,
		DeleteOrganization,
		FindByIntegranteEmailOrganization,
		FindByStatusOrganization,
		CreateNotification,
		FindOperator,
		UpdateOperator,
		{
			provide: IOrganizationRepository,
			useClass: OrganizationRepository,
		},
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
		{
			provide: IDocumentRepository,
			useClass: DocumentRepository,
		},
		{
			provide: INotificationRepository,
			useClass: NotificationRepository,
		},
		{
			provide: IOrchestratorRepository,
			useClass: OrchestratorRepository,
		},
		{
			provide: IUserTokenRepository,
			useClass: UserTokenRepository,
		},
		{
			provide: IOperatorRepository,
			useClass: OperatorRepository,
		},
	],
})
export class OrganizationModule { }

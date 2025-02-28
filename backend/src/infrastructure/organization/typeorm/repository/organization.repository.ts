import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'multer';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { Organization as DomainOrganization } from 'src/domain/organization/model/organization.entity';
import { OrganizationStatus } from 'src/domain/organization/model/status.enum';
import { IDocumentRepository } from 'src/domain/organization/port/IDocumentRepository';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { Organization as TypeORMOrganization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { UserRepository } from 'src/infrastructure/user/typeorm/repository/user.repository';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { In, Not, Repository } from 'typeorm';
import { OrganizationMapper } from '../mapper/organization-typeorm.mapper';
import { Document } from '../model/document.entity';
import { OrganizationUser as TypeORMOperator } from '../model/organization-user.entity';
// import { IOperatorRepository } from 'src/domain/organization/port/iOperatorRepository';
// import { OperatorRepository } from './operator.repository';
// import { OrganizationOperatorMapper } from '../mapper/organization-operator-typeorm.mapper';
import { IOperatorRepository } from 'src/domain/organization/port/iOperatorRepository';
import { User } from 'src/infrastructure/user/typeorm/model/user.entity';
import { OperatorRepository } from './operator.repository';
// import { FindUsers } from 'src/domain/user/case/findUsers.case';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
	constructor(
		@InjectRepository(TypeORMOrganization)
		private readonly organizationRepository: Repository<TypeORMOrganization>,
		@Inject(IDocumentRepository)
		private documentRepository: IDocumentRepository,
		@Inject(IUserRepository)
		private userRepository: UserRepository,
		@Inject(IOperatorRepository)
		private operatorRepository: OperatorRepository,
		private minioClientService: MinioClientService,
		private readonly createNotification: CreateNotification // private readonly findUser: FindUsers
	) {}

	async findByIntegrante(userId: string): Promise<DomainOrganization[]> {
		const organizations = await this.organizationRepository
			.createQueryBuilder('organization')
			.leftJoinAndSelect('organization.owner', 'owner')
			.leftJoinAndSelect('organization.operators', 'operator')
			.leftJoinAndSelect('organization.principalCategory', 'principalCategory')
			.leftJoinAndSelect('organization.categories', 'categories')
			.leftJoinAndSelect(
				'organization.supportingDocumentation',
				'supportingDocumentation'
			)
			.where('operator.userId = :opId OR owner.id = :opId', {
				opId: userId,
			})
			.andWhere('organization.status != :deletedStatus', {
				deletedStatus: OrganizationStatus.DELETED,
			})
			.getMany();

		return organizations.map((organization) =>
			OrganizationMapper.toDomain(organization)
		);
	}

	async findByOwner(ownerId: string): Promise<DomainOrganization[]> {
		try {
			const organizations = await this.organizationRepository.find({
				where: {
					owner: { id: ownerId },
					status: Not(OrganizationStatus.DELETED),
				}, // Cambio en la condición de búsqueda
				relations: [
					'owner',
					'operators',
					'operators.user',
					'operators.organization',
					'categories',
					'principalCategory',
					'validator',
					'supportingDocumentation',
				],
			});

			return organizations.map((organization) => {
				return OrganizationMapper.toDomain(organization);
			});
		} catch (error) {
			console.log(
				'🚀 ~ file: organization.repository.ts:88 ~ OrganizationRepository ~ findByOwner ~ error:',
				error
			);
		}
	}

	async findByOperator(operatorId: string): Promise<DomainOrganization[]> {
		const organizations = await this.organizationRepository
			.createQueryBuilder('organization')
			.leftJoinAndSelect('organization.operators', 'operator')
			.where('operator.id = :opId', {
				opId: operatorId,
			})
			.where({ status: Not(OrganizationStatus.DELETED) })
			.leftJoinAndSelect('organization.categories', 'categories')
			.leftJoinAndSelect('organization.principalCategory', 'principalCategory')
			.leftJoinAndSelect('organization.validator', 'validator')
			.leftJoinAndSelect(
				'organization.supportingDocumentation',
				'supportingDocumentation'
			)
			.getMany();
		return organizations.map((organization) =>
			OrganizationMapper.toDomain(organization)
		);
	}

	async findAll(): Promise<DomainOrganization[]> {
		const organizations = await this.organizationRepository.find({
			relations: [
				'owner',
				'operators',
				'operators.user',
				'operators.organization',
				'categories',
				'principalCategory',
				'validator',
				'supportingDocumentation',
			],
			where: { status: Not(OrganizationStatus.DELETED) },
		});

		return organizations.map((organization) =>
			OrganizationMapper.toDomain(organization)
		);
	}

	async findByID(id: string): Promise<DomainOrganization> {
		const organization = await this.organizationRepository.findOne({
			where: { id: id, status: Not(OrganizationStatus.DELETED) },
			relations: [
				'owner',
				'operators',
				'operators.user',
				'operators.organization',
				'categories',
				'principalCategory',
				'validator',
				'supportingDocumentation',
			],
		});

		return organization ? OrganizationMapper.toDomain(organization) : null;
	}

	async update(
		aOrganization: DomainOrganization,
		supportingDocumentation: MulterFile
	): Promise<DomainOrganization> {
		const typeORMOrganization = OrganizationMapper.toTypeORM(aOrganization);
		const organizationEntity = await this.findByID(aOrganization.id);

		const domainUpdatedOrganization =
			await this.organizationRepository.manager.transaction(
				async (transactionalOrganizationManager) => {
					try {
						// Eliminar los operadores que fueron eliminados en el client
						for (const operator of organizationEntity.operators) {
							if (
								!typeORMOrganization.operators.find(
									(aOperator) => aOperator.id === operator.id
								)
							) {
								await this.operatorRepository.delete(operator.id);
							}
						}
						for (const aOperator of typeORMOrganization.operators) {
							if (!aOperator.id) {
								const aNewOrganization = new TypeORMOrganization();
								aNewOrganization.id = typeORMOrganization.id;
								aOperator.organization = aNewOrganization;

								if (aOperator.status !== 'NOT_EXISTS') {
									// chequear si ya existe un usuario operador para esta organizacion
									aOperator.status = 'PENDING';

									//esto es para mandarle la notificacion
									const title = 'Solicitud de operación en organización';

									const description = `La organización:\n${typeORMOrganization.legalName}\n ha indicado que usted es operador de la misma`;
									const link = `/request/organization/operator/${aOrganization.id}.${aOperator.user.id}`;
									await this.createNotification.createByUser(
										title,
										description,
										link,
										aOperator.user as any
									);

									await transactionalOrganizationManager.save(
										TypeORMOperator,
										aOperator
									);
								}
								// ELSE INFORMAR QUE EL USUARIO NO EXISTE
							}
							const aNewOrganization = new TypeORMOrganization();
							aNewOrganization.id = typeORMOrganization.id;
							aOperator.organization = aNewOrganization;
						}
						const updatedOrganization =
							await transactionalOrganizationManager.save(typeORMOrganization);

						if (supportingDocumentation) {
							const documents =
								await this.documentRepository.findByOrganization(
									OrganizationMapper.toDomain(updatedOrganization)
								);
							documents.map(async (doc) => {
								await transactionalOrganizationManager.delete(Document, doc.id);
							});
							for (const doc of supportingDocumentation) {
								const uri = await this.minioClientService.verifyBucket(
									updatedOrganization.id,
									doc
								);
								const aDocument = new Document();

								aDocument.name = doc.originalname;
								aDocument.url = uri;
								aDocument.organization = updatedOrganization;
								//reemplazar esto por la descripcion que ponga la persona en el front
								aDocument.description = 'descripcion_' + doc.originalname;
								await transactionalOrganizationManager.save(
									Document,
									aDocument
								);
							}
						}
						return OrganizationMapper.toDomain(updatedOrganization);
					} catch (error) {
						console.log(
							'🚀 ~ file: organization.repository.ts:240 ~ OrganizationRepository ~ error:',
							error
						);
						throw new Error(error.message);
					}
				}
			);
		return domainUpdatedOrganization;
	}

	async create(
		aOrganization: DomainOrganization,
		supportingDocumentation: MulterFile
	): Promise<DomainOrganization> {
		const typeORMOrganization = OrganizationMapper.toTypeORM(aOrganization);
		const domainSavedOrganization =
			await this.organizationRepository.manager.transaction(
				async (transactionalOrganizationManager) => {
					try {
						const aOrganization = await transactionalOrganizationManager.save(
							typeORMOrganization
						);

						for (const aOperator of typeORMOrganization.operators) {
							if (!aOperator.id) {
								const aNewOrganization = new TypeORMOrganization();
								aNewOrganization.id = typeORMOrganization.id;
								aOperator.organization = aNewOrganization;

								if (aOperator.status !== 'NOT_EXISTS') {
									aOperator.status = 'PENDING';

									//esto es para mandarle la notificacion
									const title = 'Solicitud de operación en organización';

									const description = `La organización:\n${typeORMOrganization.legalName}\n ha indicado que usted es operador de la misma`;
									const link = `/request/organization/operator/${aOrganization.id}.${aOperator.user.id}`;
									await this.createNotification.createByUser(
										title,
										description,
										link,
										aOperator.user as any
									);

									await transactionalOrganizationManager.save(
										TypeORMOperator,
										aOperator
									);
								} else {
									aOperator.id = '-1';

									aOperator.user = new User();
									aOperator.user.id = '-1';
									aOperator.user.password = '';
									aOperator.user.status = '';
									aOperator.user.createdAt = new Date();
									aOperator.user.updatedAt = new Date();
									aOperator.user.email = aOperator.user.email;

									const aNewOrganization = new TypeORMOrganization();
									aNewOrganization.id = typeORMOrganization.id;
									aOperator.organization = aNewOrganization;
								}
							} else {
								const aNewOrganization = new TypeORMOrganization();
								aNewOrganization.id = typeORMOrganization.id;
								aOperator.organization = aNewOrganization;
								await transactionalOrganizationManager.update(
									TypeORMOperator,
									aOperator.id,
									aOperator
								);
							}
						}

						if (supportingDocumentation) {
							for (const doc of supportingDocumentation) {
								const uri = await this.minioClientService.verifyBucket(
									aOrganization.id,
									doc
								);

								const aDocument = new Document();

								aDocument.name = doc.originalname;
								aDocument.url = uri;
								aDocument.organization = aOrganization;
								//reemplazar esto por la descripcion que ponga la persona en el front
								aDocument.description = 'descripcion_' + doc.originalname;
								await transactionalOrganizationManager.save(
									Document,
									aDocument
								);
							}
						}
						return OrganizationMapper.toDomain(aOrganization);
					} catch (error) {
						throw new Error(
							'Error al crear la organización, intente nuevamente'
						);
					}
				}
			);
		return domainSavedOrganization;
	}
	catch(error) {
		throw new Error(error.message);
	}

	async findByStatus(someStatus: string[]): Promise<DomainOrganization[]> {
		// queryBuilder.andWhere('organization.legalName IN (:...organizations)', { organizations });
		const organizations = await this.organizationRepository.find({
			where: { status: In(someStatus) },
			relations: [
				'owner',
				'operators', // Asegúrate de que esta relación está configurada en la entidad Organizacion
				'operators.user', // Asegúrate de que esta relación está configurada en la entidad Operadores
				'operators.organization', // Asegúrate de que esta relación está configurada en la entidad Operadores
				'categories',
				'principalCategory',
				'validator',
				'supportingDocumentation',
			],
		});

		return organizations.map((organization) =>
			OrganizationMapper.toDomain(organization)
		);
	}
}

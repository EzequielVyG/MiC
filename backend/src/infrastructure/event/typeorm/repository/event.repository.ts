import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'multer';
import { EventStatus } from 'src/domain/event/model/event-status.enum';
import { Event as DomainEvent } from 'src/domain/event/model/event.entity';
import { IEventRepository } from 'src/domain/event/port/iEventRepository';
import {
	EventParticipant,
	EventParticipant as TypeORMParticipant,
} from 'src/infrastructure/event/typeorm/model/event-participant.entity';
import { Event as TypeORMEvent } from 'src/infrastructure/event/typeorm/model/event.entity';
import { EntityManager, Repository } from 'typeorm';
import { EventMapper } from '../mapper/event-typeorm.mapper';
import {
	EventFlyer,
	EventFlyer as TypeORMEventFlyer,
} from '../model/event-flyer.entity';
import {
	EventPhoto,
	EventPhoto as TypeORMEventPhoto,
} from '../model/event-photo.entity';

import EventHandicap from 'src/domain/event/model/event-handicap';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { FindByIntegranteEmailOrganization } from 'src/domain/organization/case/findByIntegranteEmailOrganization';
import { FindOperator } from 'src/domain/organization/case/findOperator.case';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';
import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { OrganizationMapper } from 'src/infrastructure/organization/typeorm/mapper/organization-typeorm.mapper';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Injectable()
export class EventRepository implements IEventRepository {
	constructor(
		@InjectRepository(TypeORMEvent)
		private readonly eventRepository: Repository<TypeORMEvent>,
		@InjectRepository(TypeORMEventPhoto)
		private readonly photoRepository: Repository<TypeORMEventPhoto>,
		@InjectRepository(TypeORMEventFlyer)
		private readonly flyerRepository: Repository<TypeORMEventFlyer>,
		@InjectEntityManager()
		private readonly manager: EntityManager,
		@InjectRepository(TypeORMParticipant)
		private readonly participantRepository: Repository<TypeORMParticipant>,
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
		private minioClientService: MinioClientService,
		private readonly findByIntegranteEmailOrganization: FindByIntegranteEmailOrganization,
		private readonly createNotification: CreateNotification,
		private readonly findOperator: FindOperator
	) { }

	private getQueryBuilder() {
		return this.eventRepository
			.createQueryBuilder('event')
			.leftJoinAndSelect('event.place', 'place')
			.leftJoinAndSelect('event.creator', 'creator')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoin('organization.operators', 'operators')
			.leftJoinAndSelect('event.principalCategory', 'principalCategory')
			.leftJoinAndSelect('event.categories', 'categories')
			.leftJoinAndSelect('event.photos', 'photos')
			.leftJoinAndSelect('event.flyers', 'flyers')
			.leftJoinAndSelect('event.participants', 'participants')
			.leftJoinAndSelect(
				'participants.organization',
				'participantOrganization'
			);
	}

	async findByCategories(categories: string[]): Promise<DomainEvent[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);

		const events = await this.getQueryBuilder()
			.andWhere(
				'((principalCategory.id IN (:...categoryIds)) OR (categories.id IN (:...categoryIds))) AND ' +
				'event.status = :estadoActivo AND event.startDate >= :fechaActual',
				{
					categoryIds: categories,
					estadoActivo: EventStatus.SCHEDULED,
					fechaActual: fechaActual,
				}
			)
			.orderBy('event.startDate', 'ASC')
			.getMany();

		return events.map((event) => EventMapper.toDomain(event));
	}

	async findByCategory(categoryId: string): Promise<DomainEvent[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const aCategory = await this.categoryRepository.findOne({
			where: { id: categoryId },
		});
		const typeORMCategory = CategoryMapper.toTypeORM(aCategory);

		const recursiveQuery = `WITH RECURSIVE category_tree AS (
			SELECT id, name, father
			FROM categories
			WHERE id = $1
			UNION ALL
			SELECT c.id, c.name, c.father
			FROM categories c
			JOIN category_tree ct ON c.father = ct.id
		  )
		  SELECT * FROM category_tree;
		`;
		const children = await this.manager.query(recursiveQuery, [
			typeORMCategory.id,
		]);
		const query = this.getQueryBuilder()
			.addSelect([
				`(CASE WHEN categories.id = :catId THEN 0 
				WHEN principalCategory.id = :catId THEN 0
				WHEN categories.id IN (:...childrenIds) OR principalCategory.id IN (:...childrenIds) THEN 1
				ELSE NULL END) as isPrincipalCategory`,
			])
			.where(
				'(categories.id = :catId OR principalCategory.id = :catId OR categories.id IN (:...childrenIds) OR principalCategory.id IN (:...childrenIds))' +
				'AND event.startDate >= :fechaActual AND event.status = :status',
				{
					catId: typeORMCategory.id,
					childrenIds: children.map((c) => c.id),
					fechaActual: fechaActual,
					status: EventStatus.SCHEDULED,
				}
			)
			.orderBy('isPrincipalCategory', 'ASC')
			.addOrderBy('event.startDate', 'ASC');

		const results = await query.getMany();

		return results.map((event) => EventMapper.toDomain(event));
	}

	async findByUser(userId: string): Promise<DomainEvent[]> {
		const events = await this.eventRepository
			.createQueryBuilder('event')
			.leftJoinAndSelect('event.place', 'place')
			.leftJoinAndSelect('event.creator', 'creator')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoin('organization.operators', 'operators')
			.where(
				'(operators.id = :userId OR organization.owner = :userId OR event.user_id = :userId)',
				{ userId }
			)
			.orderBy('event.startDate', 'ASC')
			.getMany();
		return events.map((event) => EventMapper.toDomain(event));
	}

	async findByFilters(
		statuses: EventStatus[],
		organizations: string[]
	): Promise<DomainEvent[]> {
		const queryBuilder = this.eventRepository
			.createQueryBuilder('event')
			.leftJoinAndSelect('event.participants', 'participants')
			.orderBy('event.startDate', 'ASC');

		if (statuses.length > 0) {
			queryBuilder.andWhere('event.status IN (:...statuses)', {
				statuses,
			});
		}
		if (organizations.length > 0) {
			queryBuilder.innerJoinAndSelect('participants.organization', 'someOrg', 'someOrg.legalName IN (:...organizations)',
				{ organizations })
		}

		const events = await queryBuilder.getMany();

		return events.map((event) => EventMapper.toDomain(event));
	}

	async findByVigents(
		organizations: string[]
	): Promise<DomainEvent[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const queryBuilder = this.getQueryBuilder()
			.where('event.startDate >= :fechaActual AND event.status = :status', {
				fechaActual: fechaActual,
				status: EventStatus.SCHEDULED,
			})
			.orderBy('event.startDate', 'ASC');

		if (organizations.length > 0) {
			queryBuilder.innerJoinAndSelect('participants.organization', 'someOrg', 'someOrg.legalName IN (:...organizations)',
				{ organizations })
		}
		const events = await queryBuilder.getMany();
		return events.map((event) => EventMapper.toDomain(event));
	}

	async findByUserAndStatus(
		userId: string,
		status: EventStatus
	): Promise<DomainEvent[]> {
		const events = await this.eventRepository
			.createQueryBuilder('event')
			.leftJoinAndSelect('event.place', 'place')
			.leftJoinAndSelect('event.creator', 'creator')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoin('organization.operators', 'operators')
			.where('event.status = :status', {
				status: status,
			})
			.andWhere(
				'(operators.id = :userId OR organization.owner = :userId OR event.user_id = :userId)',
				{ userId }
			)
			.orderBy('event.startDate', 'ASC')
			.getMany();

		return events.map((event) => EventMapper.toDomain(event));
	}

	async findAll(): Promise<DomainEvent[]> {
		const events: TypeORMEvent[] = await this.eventRepository.find({
			relations: [
				'place',
				'creator',
				'photos',
				'flyers',
				'principalCategory',
				'categories',
				'participants',
				'participants.organization',
			],
		});

		return events.map((event) => EventMapper.toDomain(event));
	}

	async findById(id: string): Promise<DomainEvent> {
		const event: TypeORMEvent = await this.eventRepository.findOne({
			where: { id: id },
			relations: [
				'place',
				'creator',
				'photos',
				'flyers',
				'place.organization',
				'principalCategory',
				'categories',
				'participants',
				'participants.organization',
				'participants.event',
			],
		});
		return event ? EventMapper.toDomain(event) : null;
	}

	async findByName(name: string): Promise<DomainEvent[]> {
		const events: TypeORMEvent[] = await this.eventRepository.find({
			where: { name: name },
			relations: [
				'place',
				'creator',
				'photos',
				'flyers',
				'principalCategory',
				'categories',
			],
		});
		return events.map((event) => EventMapper.toDomain(event));
	}

	async findByStatuses(statuses: EventStatus[]): Promise<DomainEvent[]> {
		const events = await this.eventRepository
			.createQueryBuilder('event')
			.leftJoinAndSelect('event.place', 'place')
			.leftJoinAndSelect('event.creator', 'creator')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoin('organization.operators', 'operators')
			.where('event.status IN (:...statusList)', {
				statusList: statuses,
			})
			.andWhere('event.endDate >= current_timestamp OR event.endDate is null')
			.orderBy('event.startDate', 'ASC')
			.getMany();

		return events.map((event) => EventMapper.toDomain(event));
	}

	async findVigentByPlace(id_place: string): Promise<DomainEvent[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const events = await this.getQueryBuilder()
			.where('place.id = :id_place', { id_place })
			.andWhere('event.startDate >= :fechaActual', { fechaActual: fechaActual })
			.orderBy('event.startDate', 'ASC')
			.getMany();

		return events.map((event) => EventMapper.toDomain(event));
	}

	async findVigents(): Promise<DomainEvent[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const events = await this.getQueryBuilder()
			.where('event.startDate >= :fechaActual', { fechaActual: fechaActual })
			.orderBy('event.startDate', 'ASC')
			.getMany();

		return events.map((event) => EventMapper.toDomain(event));
	}

	// async findFirst15VigentEvents(): Promise<DomainEvent[]> {
	// 	const fechaActual = new Date();
	// 	fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
	// 	const events = await this.getQueryBuilder()
	// 		.andWhere('event.status = :estadoActivo', {
	// 			estadoActivo: EventStatus.SCHEDULED,
	// 		})
	// 		.andWhere('event.startDate >= :fechaActual', {
	// 			fechaActual: fechaActual,
	// 			handicap: EventHandicap,
	// 		})
	// 		.orderBy('event.startDate', 'ASC')
	// 		.getMany();
	// 	return events.map((event) => EventMapper.toDomain(event));
	// }

	async findFirst15VigentEvents(
		lat: number,
		lng: number
	): Promise<DomainEvent[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);

		const query = this.getQueryBuilder()
			.andWhere('event.status = :estadoActivo', {
				estadoActivo: EventStatus.SCHEDULED,
			})
			.andWhere('event.startDate >= :fechaActual', {
				fechaActual: fechaActual,
				handicap: EventHandicap,
			})
			.orderBy('event.startDate', 'ASC');

		if (lat && lng) {
			query.addOrderBy(
				`ST_Distance(place.location::geography, ST_MakePoint(${lng}, ${lat})::geography)`,
				'ASC'
			);
		}

		const events = await query.getMany();

		return events.map((event) => EventMapper.toDomain(event));
	}

	async create(aEvent: DomainEvent, files: MulterFile[]): Promise<DomainEvent> {
		const typeORMEvent = EventMapper.toTypeORM(aEvent);
		const savedEvent = await this.eventRepository.manager.transaction(
			async (transactionalPlaceManager) => {
				try {
					const aEvent = await transactionalPlaceManager.save(typeORMEvent);

					//esto es para tener los organizadores para que en la notificacion figuren
					let organizadores = [];
					for (const aParticipant of typeORMEvent.participants) {
						if (aParticipant.status === 'Accepted')
							organizadores = [...organizadores, aParticipant];
					}

					for (const aParticipant of typeORMEvent.participants) {
						if (!aParticipant.id) {
							const ev = new TypeORMEvent();
							ev.id = typeORMEvent.id;
							aParticipant.event = ev;

							//esto de abajo es para ponerle el status al participante
							const organizations = (
								await this.findOperator.findByUserAndStatus(
									aEvent.creator.email,
									'ACCEPTED'
								)
							).map((aOperator) => aOperator.organization);

							let perteneceAOrganizacion = false;
							for (const org of organizations) {
								if (org.id === aParticipant.organization.id) {
									perteneceAOrganizacion = true;
									break;
								}
							}

							if (perteneceAOrganizacion) {
								aParticipant.status = 'Accepted';
							} else {
								aParticipant.status = 'Pending';
								//esto es para mandarle la notificacion
								const title = 'Solicitud de participacion en evento';
								const organizadorNames = organizadores.map(
									(aParticipant) => aParticipant.organization.legalName
								);
								const organizadoresString = organizadorNames.join('\n');
								const description = `La/s organización/es:\n${organizadoresString}\norganizará/n un evento en el lugar ${aEvent.place.name} y quiere que tu organización ${aParticipant.organization.legalName} participe en este.`;
								const link = `/request/organization/${aEvent.id}.${aParticipant.organization.id}`;

								await this.createNotification.createByOrganization(
									title,
									description,
									link,
									OrganizationMapper.toDomain(aParticipant.organization)
								);
							}
							await transactionalPlaceManager.save(
								EventParticipant,
								aParticipant
							);
						} else {
							const ev = new TypeORMEvent();
							ev.id = typeORMEvent.id;
							aParticipant.event = ev;
							await transactionalPlaceManager.update(
								EventParticipant,
								aParticipant.id,
								aParticipant
							);
						}
					}

					const domainEvent = EventMapper.toDomain(aEvent);

					for (const foto of files) {
						if (foto.originalname.startsWith('fotos-')) {
							const uri = await this.minioClientService.verifyBucket(
								`event-${aEvent.id}`,
								foto
							);
							const aFoto = new EventPhoto();
							aFoto.photoUrl = uri;
							aFoto.event = EventMapper.toTypeORM(domainEvent);

							await transactionalPlaceManager.save(EventPhoto, aFoto);
						} else {
							const uri = await this.minioClientService.verifyBucket(
								`event-${aEvent.id}`,
								foto
							);
							const aFlyer = new EventFlyer();
							aFlyer.flyerUrl = uri;
							aFlyer.event = EventMapper.toTypeORM(domainEvent);

							await transactionalPlaceManager.save(EventFlyer, aFlyer);
						}
					}
					return domainEvent;
				} catch (error) {
					console.log(
						'🚀 ~ file: event.repository.ts:434 ~ EventRepository ~ error:',
						error
					);
					throw new Error('Error al crear el evento, intente nuevamente');
				}
			}
		);
		return savedEvent;
	}

	async update(event: DomainEvent, files: MulterFile[]): Promise<DomainEvent> {
		const typeORMEvent = EventMapper.toTypeORM(event);
		const eventEntity = await this.findById(event.id);

		for (const photo of eventEntity.photos) {
			if (!typeORMEvent.photos.find((aPhoto) => aPhoto.id === photo.id)) {
				this.photoRepository.delete(photo.id);
			}
		}

		for (const flyer of eventEntity.flyers) {
			if (!typeORMEvent.flyers.find((aFlyer) => aFlyer.id === flyer.id)) {
				this.flyerRepository.delete(flyer.id);
			}
		}

		const domainSavedEvent = await this.eventRepository.manager.transaction(
			async (transactionalEventManager) => {
				try {
					// Eliminar los participantes que fueron eliminados en el client
					for (const aParticipant of eventEntity.participants) {
						if (
							!typeORMEvent.participants.find(
								(aPart) => aPart.id === aParticipant.id
							)
						) {
							this.participantRepository.delete(aParticipant.id);
						}
					}
					//esto es para tener los organizadores para que en la notificacion figuren
					let organizadores = [];
					for (const aParticipant of typeORMEvent.participants) {
						if (aParticipant.status === 'Accepted')
							organizadores = [...organizadores, aParticipant];
					}
					// Crear los nuevos participantes o actualizar los existentes
					for (const aParticipant of typeORMEvent.participants) {
						if (!aParticipant.id) {
							const ev = new TypeORMEvent();
							ev.id = typeORMEvent.id;
							aParticipant.event = ev;
							//esto de abajo es para ponerle el status al participante
							const organizations =
								await this.findByIntegranteEmailOrganization.findByIntegranteEmail(
									event.creator.email
								);
							let perteneceAOrganizacion = false;
							for (const org of organizations) {
								if (org.id === aParticipant.organization.id) {
									perteneceAOrganizacion = true;
									break;
								}
							}
							if (perteneceAOrganizacion) {
								aParticipant.status = 'Accepted';
							} else {
								aParticipant.status = 'Pending';
								//esto es para mandarle la notificacion
								const title = 'Solicitud de participacion en evento';
								const organizadorNames = organizadores.map(
									(aParticipant) => aParticipant.organization.legalName
								);
								const organizadoresString = organizadorNames.join('\n');
								const description = `La/s organización/es:\n${organizadoresString}\norganizará/n un evento en el lugar ${event.place.name} y quiere que tu organización ${aParticipant.organization.legalName} participe en este.`;
								const link = `/request/organization/${event.id}.${aParticipant.organization.id}`;
								await this.createNotification.createByOrganization(
									title,
									description,
									link,
									OrganizationMapper.toDomain(aParticipant.organization)
								);
							}
							await this.participantRepository.save(aParticipant);
						} else {
							const ev = new TypeORMEvent();
							ev.id = typeORMEvent.id;
							aParticipant.event = ev;
							await this.participantRepository.update(
								aParticipant.id,
								aParticipant
							);
						}
					}

					const updatedEvent = typeORMEvent
						? await transactionalEventManager.save(typeORMEvent)
						: null;

					if (updatedEvent) {
						for (const foto of files) {
							if (foto.originalname.startsWith('fotos-')) {
								const uri = await this.minioClientService.verifyBucket(
									`place-${updatedEvent.id}`,
									foto
								);

								const aFoto = new EventPhoto();
								aFoto.photoUrl = uri;
								aFoto.event = updatedEvent;

								await transactionalEventManager.save(EventPhoto, aFoto);
							} else {
								const uri = await this.minioClientService.verifyBucket(
									`place-${updatedEvent.id}`,
									foto
								);

								const aFlyer = new EventFlyer();
								aFlyer.flyerUrl = uri;
								aFlyer.event = updatedEvent;

								await transactionalEventManager.save(EventFlyer, aFlyer);
							}
						}
					}
					return updatedEvent ? EventMapper.toDomain(updatedEvent) : null;
				} catch (error) {
					throw new Error(
						'Error al actualizar el evento, intente nuevamente ' + error
					);
				}
			}
		);
		return domainSavedEvent;
	}

	private async saveEventRelations(
		aEvent: TypeORMEvent
	): Promise<TypeORMEvent> {
		aEvent.participants.forEach(async (aParticipante) => {
			const ev = new TypeORMEvent();
			ev.id = aEvent.id;
			aParticipante.event = ev;
			await this.participantRepository.save(aParticipante);
		});

		return aEvent;
	}

	async delete(id: string): Promise<any> {
		const deletedEvent = await this.eventRepository
			.createQueryBuilder('events')
			.softDelete()
			.where('id = :id', { id: id })
			.execute();
		return deletedEvent;
	}

	async findEventsWithinOneDay(): Promise<any[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		
		const eventsAndUsers = await this.eventRepository.createQueryBuilder('event')
		.select([
		  'event.id AS event_id',
		  'event.name AS event_name',
		  'event.start_Date AS event_startDate',
		  'user.id AS user_id',
		  'user.name AS user_name',
		])
		.innerJoin('user_favorite_events', 'userFavorite', 'event.id = userFavorite.event_id')
		.innerJoin('users', 'user', 'userFavorite.user_id = user.id')
		.where('event.start_Date > :fechaActual', { fechaActual })
		.andWhere('event.start_Date <= :fechaLimite', {
		  fechaLimite: new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000),
		})
		.andWhere('event.status = :estadoActivo', { estadoActivo: EventStatus.SCHEDULED })
		.orderBy('event.start_Date', 'ASC')
		.getRawMany();
	  
	  
		return eventsAndUsers;
	  }
}

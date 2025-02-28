import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'multer';
import { Location } from 'src/domain/place/model/place-location';
import { Place as DomainPlace } from 'src/domain/place/model/place.entity';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import {
	Category,
	Category as TypeORMCategory,
} from 'src/infrastructure/category/typeorm/model/category.entity';
import {
	Place,
	Place as TypeORMPlace,
} from 'src/infrastructure/place/typeorm/model/place.entity';
import { EntityManager, Repository, TreeRepository } from 'typeorm';
import { PlaceMapper } from '../mapper/place-typeorm.mapper';
import { Accessibility } from '../model/accesibility.entity';
import { DayOfWeek as TypeORMDayOfWeek } from '../model/day-of-week.entity';
import {
	PlacePhoto,
	PlacePhoto as TypeORMPlacePhoto,
} from '../model/place-photo.entity';
import {
	PlaceSchedule,
	PlaceSchedule as TypeORMPlaceSchedule,
} from '../model/place-schedule.entity';
import { Service } from '../model/service.entity';

import { Category as DomainCategory } from 'src/domain/category/model/category.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';

import EventHandicap from 'src/domain/event/model/event-handicap';
import { EventStatus } from 'src/domain/event/model/event-status.enum';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Injectable()
export class PlaceRepository implements IPlaceRepository {
	constructor(
		@InjectRepository(TypeORMPlace)
		private readonly placeRepository: Repository<TypeORMPlace>,
		@InjectRepository(TypeORMPlaceSchedule)
		private readonly scheduleRepository: Repository<TypeORMPlaceSchedule>,
		@InjectRepository(TypeORMDayOfWeek)
		private readonly dayOfWeekRepository: Repository<TypeORMDayOfWeek>,
		@InjectRepository(TypeORMPlacePhoto)
		private readonly photoRepository: Repository<TypeORMPlacePhoto>,
		@InjectRepository(TypeORMCategory)
		private readonly categoryRepository: TreeRepository<TypeORMCategory>,
		@InjectRepository(Accessibility)
		private readonly accesibilityRepository: Repository<Accessibility>,
		@InjectRepository(Service)
		private readonly serviceRepository: Repository<Service>,
		@InjectEntityManager()
		private readonly manager: EntityManager,
		private minioClientService: MinioClientService
	) {}

	async findByOrganization(organization: Organization): Promise<DomainPlace[]> {
		const places = await this.placeRepository
			.createQueryBuilder('place')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.categories', 'categories')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.where('place.organization = :organizationId', {
				organizationId: organization.id,
			})
			.getMany();

		return places.map((place) => PlaceMapper.toDomain(place));
	}

	async findById(id: string): Promise<DomainPlace> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const place = await this.placeRepository
			.createQueryBuilder('place')
			.where('place.id = :id', {
				id: id,
			})
			.leftJoinAndSelect(
				'place.events',
				'event',
				'event.startDate >= :fechaActual AND event.status = :status',
				{ fechaActual: fechaActual, status: EventStatus.SCHEDULED }
			)
			.leftJoinAndSelect('event.photos', 'eventPhotos')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.categories', 'categories')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.getOne();

		return place ? PlaceMapper.toDomain(place) : null;
	}

	async findAll(): Promise<DomainPlace[]> {
		const places: TypeORMPlace[] = await this.placeRepository.find({
			relations: [
				'accessibilities',
				'services',
				'organization',
				'schedules',
				'schedules.dayOfWeek',
				'photos',
				'categories',
				'principalCategory',
			],
		});

		return places.map((place) => PlaceMapper.toDomain(place));
	}

	async findAllWithEvents(): Promise<DomainPlace[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const places: any[] = await this.placeRepository
			.createQueryBuilder('place')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.categories', 'categories')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.leftJoinAndSelect(
				'place.events',
				'event',
				'event.startDate >= :fechaActual AND event.status = :status',
				{ fechaActual: fechaActual, status: EventStatus.SCHEDULED }
			)
			.getMany();

		return places.map((place) => PlaceMapper.toDomain(place));
	}

	private getPlaceQueryBuilder() {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		return this.placeRepository
			.createQueryBuilder('place')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.categories', 'categories')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.leftJoinAndSelect(
				'place.events',
				'event',
				'event.startDate >= :fechaActual AND event.status = :status',
				{ fechaActual: fechaActual, status: EventStatus.SCHEDULED }
			);
	}

	async findByDistance(punto: Location): Promise<DomainPlace[]> {
		try {
			const query = this.getPlaceQueryBuilder();
			if (punto) {
				query.orderBy(
					`ST_Distance(place.location:: geography, ST_MakePoint(${punto.lng}, ${punto.lat}):: geography)`,
					'ASC'
				);
			}
			const places = await query.getMany();

			return places.map((place) => PlaceMapper.toDomain(place));
		} catch (error) {
			console.error(error);
		}
	}

	async findAllByDistance(lat: number, lng: number): Promise<DomainPlace[]> {
		const query = this.getPlaceQueryBuilder();
		if (lat && lng) {
			query.orderBy(
				`ST_Distance(place.location::geography, ST_MakePoint(${lng}, ${lat})::geography)`,
				'ASC'
			);
		}
		const places = await query.getMany();

		return places.map((place) => PlaceMapper.toDomain(place));
	}

	async findByCategories(
		category: DomainCategory[],
		lat: number,
		lng: number
	): Promise<DomainPlace[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const typeORMCategories = category.map((category) =>
			CategoryMapper.toTypeORM(category)
		);

		const categoryIds = typeORMCategories.map(
			(typeORMCategory) => typeORMCategory.id
		);

		const recursiveQuery = `WITH RECURSIVE category_tree AS (
    SELECT id, name, father
    FROM categories
    WHERE id = ANY($1::uuid[]) -- Utiliza ANY y ::uuid[] para comparar con un array de UUID
    UNION ALL
    SELECT c.id, c.name, c.father
    FROM categories c
    JOIN category_tree ct ON c.father = ct.id
)
SELECT * FROM category_tree;
		`;
		const children = await this.manager.query(recursiveQuery, [categoryIds]);
		const query = this.placeRepository
			.createQueryBuilder('place')
			.leftJoinAndSelect('place.categories', 'category')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.leftJoinAndSelect(
				'place.events',
				'event',
				'event.startDate >= :fechaActual AND event.status = :status',
				{ fechaActual: fechaActual, status: EventStatus.SCHEDULED }
			)
			.addSelect([
				`(CASE WHEN category.id IN (:...categoryIds) THEN 0 
    				WHEN principalCategory.id IN (:...categoryIds) THEN 0
    				WHEN category.id IN (:...childrenIds) OR principalCategory.id IN (:...childrenIds) THEN 1
    				ELSE NULL END) as isPrincipalCategory`,
			])
			.where(
				'category.id IN (:...categoryIds) OR principalCategory.id IN (:...categoryIds)',
				{
					categoryIds, // Esta es la parte corregida
				}
			)
			.orWhere(
				'category.id IN (:...childrenIds) OR principalCategory.id IN (:...childrenIds)',
				{ childrenIds: children.map((c) => c.id) }
			)
			.orderBy('isPrincipalCategory', 'ASC');

		if (lat && lng) {
			query.addOrderBy(
				`ST_Distance(place.location::geography, ST_MakePoint(${lng}, ${lat})::geography)`,
				'ASC'
			);
		}

		const results = await query.getMany();

		return results.map((result) => {
			const place = PlaceMapper.toDomain(result);
			return place;
		});
	}

	async findByCategory(
		category: DomainCategory,
		lat: number,
		lng: number
	): Promise<DomainPlace[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const typeORMCategory = CategoryMapper.toTypeORM(category);

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
		const query = this.placeRepository
			.createQueryBuilder('place')
			.leftJoinAndSelect('place.categories', 'category')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.leftJoinAndSelect(
				'place.events',
				'event',
				'event.startDate >= :fechaActual AND event.status = :status',
				{ fechaActual: fechaActual, status: EventStatus.SCHEDULED }
			)
			.addSelect([
				`(CASE WHEN category.id = :catId THEN 0 
					WHEN principalCategory.id = :catId THEN 0
					WHEN category.id IN (:...childrenIds) OR principalCategory.id IN (:...childrenIds) THEN 1
					ELSE NULL END) as isPrincipalCategory`,
			])
			.where('category.id = :catId OR principalCategory.id = :catId', {
				catId: typeORMCategory.id,
			})
			.orWhere(
				'category.id IN (:...childrenIds) OR principalCategory.id IN (:...childrenIds)',
				{ childrenIds: children.map((c) => c.id) }
			)
			.orderBy('isPrincipalCategory', 'ASC');

		if (lat && lng) {
			query.addOrderBy(
				`ST_Distance(place.location::geography, ST_MakePoint(${lng}, ${lat})::geography)`,
				'ASC'
			);
		}

		const results = await query.getMany();

		return results.map((result) => {
			const place = PlaceMapper.toDomain(result);
			return place;
		});
	}

	async create(aPlace: DomainPlace, files: MulterFile[]): Promise<DomainPlace> {
		const typeORMPlace = PlaceMapper.toTypeORM(aPlace);
		typeORMPlace.schedules = await this.getScheduleDays(typeORMPlace);
		typeORMPlace.principalCategory = await this.categoryRepository.findOne({
			where: { name: aPlace.principalCategory.name },
			relations: ['father'],
		});
		typeORMPlace.accessibilities = await this.getAccessibilities(typeORMPlace);
		typeORMPlace.services = await this.getServices(typeORMPlace);
		const domainSavedPlace = await this.placeRepository.manager.transaction(
			async (transactionalPlaceManager) => {
				try {
					const aPlace = await transactionalPlaceManager.save(typeORMPlace);
					await this.savePlaceRelations(aPlace, transactionalPlaceManager);

					const domainPlace = PlaceMapper.toDomain(aPlace);
					for (const foto of files) {
						const uri = await this.minioClientService.verifyBucket(
							`place-${aPlace.id}`,
							foto
						);

						const aFoto = new PlacePhoto();
						aFoto.photoUrl = uri;
						aFoto.place = PlaceMapper.toTypeORM(domainPlace);

						await transactionalPlaceManager.save(PlacePhoto, aFoto);
					}
					return domainPlace;
				} catch (error) {
					throw new Error('Error al crear el lugar, intente nuevamente');
				}
			}
		);
		return domainSavedPlace;
	}

	async update(place: DomainPlace, files: MulterFile[]): Promise<DomainPlace> {
		const placeEntity = await this.findById(place.id);
		const placeORM = placeEntity ? PlaceMapper.toTypeORM(place) : null;

		placeORM.principalCategory = place.principalCategory
			? await this.categoryRepository.findOne({
					where: { name: place.principalCategory.name },
					relations: ['father'],
			  })
			: null;
		if (placeORM) {
			placeORM.id = place.id;
			placeORM.origin = 'WEB';
		}

		for (const schedule of placeEntity.schedules) {
			if (
				!placeORM.schedules.find((aSchedule) => aSchedule.id === schedule.id)
			) {
				this.scheduleRepository.delete(schedule);
			}
		}

		for (const photo of placeEntity.photos) {
			if (!placeORM.photos.find((aPhoto) => aPhoto.id === photo.id)) {
				this.photoRepository.delete(photo.id);
			}
		}

		placeORM.categories = await this.getCategories(placeORM);
		placeEntity.photos.forEach((photo) => {
			if (!placeORM.photos.find((aPhoto) => aPhoto.id === photo.id)) {
			}
		});

		placeORM.accessibilities = await this.getAccessibilities(placeORM);
		placeORM.services = await this.getServices(placeORM);

		const domainSavedPlace = await this.placeRepository.manager.transaction(
			async (transactionalPlaceManager) => {
				try {
					const updatedPlace = placeORM
						? await transactionalPlaceManager.save(placeORM)
						: null;
					await this.savePlaceRelations(
						updatedPlace,
						transactionalPlaceManager
					);

					if (updatedPlace) {
						for (const foto of files) {
							const uri = await this.minioClientService.verifyBucket(
								`place-${updatedPlace.id}`,
								foto
							);

							const aFoto = new PlacePhoto();
							aFoto.photoUrl = uri;
							aFoto.place = updatedPlace;

							await transactionalPlaceManager.save(PlacePhoto, aFoto);
						}
					}
					return updatedPlace ? PlaceMapper.toDomain(updatedPlace) : null;
				} catch (error) {
					throw new Error('Error desconocido');
				}
			}
		);
		return domainSavedPlace;
	}

	async findByName(name: string): Promise<DomainPlace> {
		const aPlaceORM = await this.placeRepository.findOne({
			where: { name: name },
			relations: [
				'accessibilities',
				'services',
				'organization',
				'schedules',
				'schedules.dayOfWeek',
				'photos',
				'categories',
				'categories.category',
				'principalCategory',
			],
		});

		return aPlaceORM ? PlaceMapper.toDomain(aPlaceORM) : null;
	}

	async delete(id: string): Promise<DomainPlace> {
		const aPlace = await this.findById(id);
		if (!aPlace) {
			return null;
		}
		await this.placeRepository.softRemove(PlaceMapper.toTypeORM(aPlace));
		return aPlace;
	}

	private async savePlaceRelations(
		place: Place,
		transactionalManager: any
	): Promise<TypeORMPlace> {
		for (const schedule of place.schedules) {
			schedule.dayOfWeek = await this.dayOfWeekRepository.findOne({
				where: { name: schedule.dayOfWeek.name },
			});
			schedule.place = place;
			await transactionalManager.save(PlaceSchedule, schedule);
		}

		return place;
	}

	private async getAccessibilities(
		place: TypeORMPlace
	): Promise<Accessibility[]> {
		const someAccessibilities = [];
		for (let a of place.accessibilities) {
			a = await this.accesibilityRepository.findOne({
				where: { name: a.name },
			});
			someAccessibilities.push(a);
		}

		return someAccessibilities;
	}

	private async getServices(place: TypeORMPlace): Promise<Service[]> {
		const someServices = [];
		for (let s of place.services) {
			s = await this.serviceRepository.findOne({ where: { name: s.name } });
			someServices.push(s);
		}
		return someServices;
	}

	private async getScheduleDays(place: TypeORMPlace): Promise<PlaceSchedule[]> {
		const someSchedules = [];
		for (const schedule of place.schedules) {
			schedule.dayOfWeek = await this.dayOfWeekRepository.findOne({
				where: { name: schedule.dayOfWeek.name },
			});
			someSchedules.push(schedule);
		}
		return someSchedules;
	}

	private async getCategories(place: TypeORMPlace): Promise<Category[]> {
		const someCategories: Category[] = [];
		for (const category of place.categories) {
			const aCategory = await this.categoryRepository.findOne({
				where: { name: category.name },
			});
			someCategories.push(aCategory);
		}
		return someCategories;
	}

	private async getPrincipalCategory(place: TypeORMPlace): Promise<Category> {
		const aPrincipalCategory = await this.categoryRepository.findOne({
			where: { name: place.principalCategory.name },
		});
		return aPrincipalCategory;
	}

	private async getPhotos(place: TypeORMPlace): Promise<TypeORMPlacePhoto[]> {
		const somePhotos: TypeORMPlacePhoto[] = [];
		for (let photo of place.photos) {
			photo = await this.photoRepository.findOne({
				where: { photoUrl: photo.photoUrl },
			});
			somePhotos.push(photo);
		}
		return somePhotos;
	}
}

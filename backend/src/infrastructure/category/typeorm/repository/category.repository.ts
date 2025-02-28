import { IsNull, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Category as TypeORMCategory } from 'src/infrastructure/category/typeorm/model/category.entity';
import { Category as DomainCategory } from 'src/domain/category/model/category.entity';
import { ICategoryRepository } from 'src/domain/category/port/iCategoryRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryMapper } from '../mapper/category.typeorm.mapper';
import { EventStatus } from 'src/domain/event/model/event-status.enum';
import EventHandicap from 'src/domain/event/model/event-handicap';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
	constructor(
		@InjectRepository(TypeORMCategory)
		private readonly categoryRepository: Repository<TypeORMCategory>
	) { }

	async findByFatherAndGroups(
		father: DomainCategory | null,
		groups: string[]
	): Promise<DomainCategory[]> {
		return await this.categoryRepository
			.createQueryBuilder('category')
			.where({ father: father === null ? IsNull() : father })
			.andWhere('category.group IN (:...groups)', { groups })
			.getMany()
			.then((categories) =>
				categories.map((category) => CategoryMapper.toDomain(category))
			);
	}

	async findAll(): Promise<DomainCategory[]> {
		const categories = await this.categoryRepository.find({
			relations: ['father'],
		});
		return categories.map((category) => CategoryMapper.toDomain(category));
	}

	async findAllWithPlaces(): Promise<DomainCategory[]> {
		const categories = await this.categoryRepository
			.createQueryBuilder('category')
			.where((qb) => {
				const subQuery = qb
					.subQuery()
					.select('1')
					.from('places', 'place')
					.innerJoin('place.categories', 'cp')
					.innerJoin('place.principalCategory', 'principalCategory')
					.where('cp.id = category.id')
					.orWhere('principalCategory.id = category.id')
					.getQuery();
				return `EXISTS ${subQuery}`;
			})
			.getMany();
		return categories.map((category) => CategoryMapper.toDomain(category));
	}

	async findAllWithVigentEvents(): Promise<DomainCategory[]> {
		const fechaActual = new Date();
		fechaActual.setMinutes(fechaActual.getMinutes() - EventHandicap);
		const categories = await this.categoryRepository
			.createQueryBuilder('category')
			.where((qb) => {
				const subQuery = qb
					.subQuery()
					.select('1')
					.from('events', 'event')
					.innerJoin('event.principalCategory', 'cp')
					.innerJoin('event.categories', 'categories')
					.where(
						'((cp.id = category.id) OR (category.id IN (SELECT categories.id FROM events))) ' +
						' AND (event.startDate >= :fechaActual AND event.status = :status)',
						{
							fechaActual: fechaActual,
							status: EventStatus.SCHEDULED,
						}
					)
					.getQuery();
				return `EXISTS ${subQuery}`;
			})
			.getMany();
		return categories.map((category) => CategoryMapper.toDomain(category));
	}

	async findAllByIds(ids: string[]): Promise<DomainCategory[]> {
		return await this.categoryRepository
			.createQueryBuilder('category')
			.where('id IN (:...ids)', { ids })
			.getMany()
			.then((categories) =>
				categories.map((category) => CategoryMapper.toDomain(category))
			);
	}

	async findAllWithCircuits(): Promise<DomainCategory[]> {
		return null;
	}

	async findAllEvent(): Promise<DomainCategory[]> {
		const categories = await this.categoryRepository.find({
			where: { group: 'Eventos' },
			relations: ['father'],
		});
		return categories.map((category) => CategoryMapper.toDomain(category));
	}

	// un nombre mejor es findAllEventn't
	async findAllNotEvent(): Promise<DomainCategory[]> {
		const categories = await this.categoryRepository.find({
			where: { group: Not('Eventos') },
			relations: ['father'],
		});
		return categories.map((category) => CategoryMapper.toDomain(category));
	}

	async findByID(id: string): Promise<DomainCategory> {
		const category = await this.categoryRepository.findOne({
			where: { id: id },
			relations: ['father'],
		});
		return category ? CategoryMapper.toDomain(category) : null;
	}

	async findByFather(father: DomainCategory | null): Promise<DomainCategory[]> {
		let categories = [];
		if (father === null) {
			categories = await this.categoryRepository.find({
				where: { father: IsNull() },
			});
		} else {
			categories = await this.categoryRepository.find({
				where: { father: father },
			});
		}
		return categories.map((category) => CategoryMapper.toDomain(category));
	}

	async create(aCategory: DomainCategory): Promise<DomainCategory> {
		const typeORMCategory = CategoryMapper.toTypeORM(aCategory);
		const savedCategory = await this.categoryRepository.save(typeORMCategory);
		return CategoryMapper.toDomain(savedCategory);
	}

	async update(aCategory: DomainCategory): Promise<DomainCategory> {
		const typeORMCategory = CategoryMapper.toTypeORM(aCategory);
		const savedCategory = await this.categoryRepository.save(typeORMCategory);
		return CategoryMapper.toDomain(savedCategory);
	}
}

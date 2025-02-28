import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Category as DomainCategory } from 'src/domain/category/model/category.entity';
import { Circuit as DomainCircuit } from 'src/domain/circuit/model/circuit.entity';
import { ICircuitRepository } from 'src/domain/circuit/port/iCircuitRepository';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';
import {
	Category as TypeORMCategory,
} from 'src/infrastructure/category/typeorm/model/category.entity';
import {
	Circuit as TypeORMCircuit
} from 'src/infrastructure/circuit/typeorm/model/circuit.entity';
import { Place } from 'src/infrastructure/place/typeorm/model/place.entity';
import { EntityManager, Repository } from 'typeorm';
import { CircuitMapper } from '../mapper/circuit-typeorm.mapper';

@Injectable()
export class CircuitRepository implements ICircuitRepository {
	constructor(
		@InjectRepository(TypeORMCircuit)
		private readonly circuitRepository: Repository<TypeORMCircuit>,
		@InjectRepository(Place)
		private readonly placeRepository: Repository<Place>,
		@InjectRepository(TypeORMCategory)
		private readonly categoryRepository: Repository<TypeORMCategory>,
		@InjectEntityManager()
		private readonly manager: EntityManager
	) { }

	async findById(id: string): Promise<DomainCircuit> {
		const circuit = await this.circuitRepository.findOne({
			where: { id: id },
			relations: [
				'places',
				'places.categories',
				'places.photos',
				'places.principalCategory',
				'places.organization',
				'places.services',
				'places.accessibilities',
				// 'places.schedules',
				'principalCategory',
				'categories',
				'principalCategory.father'
			],
		});

		return circuit ? CircuitMapper.toDomain(circuit) : null;
	}

	async findAll(): Promise<DomainCircuit[]> {
		const circuits: TypeORMCircuit[] = await this.circuitRepository.find({
			relations: [
				'places',
				'places.categories',
				'places.photos',
				'places.principalCategory',
				'places.organization',
				'places.services',
				'places.accessibilities',
				'places.events',
				// 'places.schedules',
				'principalCategory',
				'categories',
				'principalCategory.father'
			],
		});

		return circuits.map((circuit) => CircuitMapper.toDomain(circuit));
	}

	async create(aCircuit: DomainCircuit): Promise<DomainCircuit> {
		const typeORMCircuit = CircuitMapper.toTypeORM(aCircuit);
		typeORMCircuit.places = await this.getPlaces(typeORMCircuit);
		typeORMCircuit.principalCategory = await this.categoryRepository.findOne({
			where: { name: aCircuit.principalCategory.name },
		});

		const savedCircuit = await this.circuitRepository.save(typeORMCircuit);
		return CircuitMapper.toDomain(savedCircuit);
	}

	async update(circuit: DomainCircuit): Promise<DomainCircuit> {

		const circuitEntity = await this.findById(circuit.id);
		const circuitORM = circuitEntity ? CircuitMapper.toTypeORM(circuit) : null;

		circuitORM.principalCategory = circuit.principalCategory
			? await this.categoryRepository.findOne({
				where: { name: circuit.principalCategory.name },
			})
			: null;

		if (circuitORM) {
			circuitORM.id = circuit.id;
		}

		circuitORM.places = await this.getPlaces(circuitORM);
		try {
			const updatedCircuit = circuitORM
				? await this.circuitRepository.save(circuitORM)
				: null;
			return updatedCircuit ? CircuitMapper.toDomain(updatedCircuit) : null;
		} catch (error) {
			throw new Error(`${error.query}`);
		}
	}

	async findByName(name: string): Promise<DomainCircuit> {
		const aCircuitORM = await this.circuitRepository.findOne({
			where: { name: name },
		});

		return aCircuitORM ? CircuitMapper.toDomain(aCircuitORM) : null;
	}

	async findByCategory(category: DomainCategory): Promise<DomainCircuit[]> {
		const typeORMCategory = CategoryMapper.toTypeORM(category);

		const query =
			`WITH RECURSIVE category_tree AS (
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

		const children = await this.manager.query(query, [typeORMCategory.id]);
		const places = this.circuitRepository
			.createQueryBuilder('circuit')
			.leftJoinAndSelect('circuit.principalCategory', 'principalCategory')
			.leftJoinAndSelect('circuit.categories', 'categories')
			.leftJoinAndSelect('circuit.places', 'place')
			.leftJoinAndSelect('principalCategory.father', 'principalFather')
			.leftJoinAndSelect('place.categories', 'categories')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'placePrincipalCategory')
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.addSelect([
				`(CASE
					WHEN principalCategory.id = :catId THEN 0
					WHEN principalCategory.id IN (:...childrenIds) THEN 1
					WHEN principalCategory.id = :fatherId THEN 2
					ELSE NULL END) as isPrincipalCategory`,
			])
			.where('principalCategory.id = :catId', {
				catId: typeORMCategory.id,
			})
			.where('principalCategory.id = :fatherId', {
				fatherId: category.father ? category.father.id : null
			})
			.orWhere('principalCategory.id IN (:...childrenIds)', { childrenIds: children.map((c) => c.id) })
			.orderBy('isPrincipalCategory', 'ASC');

		const results = await places.getMany();

		return results.map((result) => {
			const place = CircuitMapper.toDomain(result);
			return place;
		});
	}

	async delete(id: string): Promise<DomainCircuit> {
		const aCircuit = await this.findById(id);
		const deletedCircuit = aCircuit
			? await this.circuitRepository.remove(CircuitMapper.toTypeORM(aCircuit))
			: null;
		return deletedCircuit ? CircuitMapper.toDomain(deletedCircuit) : null;
	}

	private async getPlaces(
		circuit: TypeORMCircuit
	): Promise<Place[]> {
		const someplaces = [];
		for (let a of circuit.places) {
			a = await this.placeRepository.findOne({
				where: { name: a.name },
			});
			someplaces.push(a);
		}

		return someplaces;
	}

	private async getPrincipalCategory(circuit: TypeORMCircuit): Promise<TypeORMCategory> {
		const aPrincipalCategory = await this.categoryRepository.findOne({
			where: { name: circuit.principalCategory.name },
		});
		return aPrincipalCategory;
	}
}

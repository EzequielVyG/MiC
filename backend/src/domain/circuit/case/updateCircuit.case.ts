import { Inject, Injectable } from '@nestjs/common';
import { Category } from 'src/domain/category/model/category.entity';
import { Place } from 'src/domain/place/model/place.entity';
import { Circuit } from '../model/circuit.entity';
import { ICircuitRepository } from '../port/iCircuitRepository';
import { IUpdateCircuit } from '../port/iUpdateCircuit';

@Injectable()
export class UpdateCircuit implements IUpdateCircuit {
	constructor(
		@Inject(ICircuitRepository)
		private readonly circuitRepository: ICircuitRepository
	) {}
	async update(
		id: string,
		name: string,
		description: string,
		places: Place[],
		principalCategory: Category,
		categories: Category[]
	): Promise<Circuit> {
		const circuitSearched = await this.circuitRepository.findById(id);

		if (!circuitSearched) {
			throw new Error('El circuito a actualizar no existe');
		}

		circuitSearched.name = name;
		circuitSearched.description = description;
		circuitSearched.places = places;
		circuitSearched.principalCategory = principalCategory;
		if (!categories.find((category) => category.id === principalCategory.id)) {
			categories.push(principalCategory);
		}
		circuitSearched.categories = categories;

		const aCircuitEntity = await this.circuitRepository.update(circuitSearched);

		return aCircuitEntity;
	}
}

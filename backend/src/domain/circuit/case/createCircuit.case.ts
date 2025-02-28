import { Inject, Injectable } from '@nestjs/common';
import { Category } from 'src/domain/category/model/category.entity';
import { Place } from 'src/domain/place/model/place.entity';
import { Circuit } from '../model/circuit.entity';
import { ICircuitRepository } from '../port/iCircuitRepository';
import { ICreateCircuit } from '../port/iCreateCircuit';
import { validateCircuit } from './validation';

@Injectable()
export class CreateCircuit implements ICreateCircuit {
	constructor(
		@Inject(ICircuitRepository)
		private readonly circuitRepository: ICircuitRepository
	) {}

	async create(
		name: string,
		description: string,
		places: Place[],
		principalCategory: Category,
		categories: Category[]
	): Promise<Circuit> {
		const aCircuit = new Circuit();
		aCircuit.name = name;
		aCircuit.description = description;
		aCircuit.places = places;
		aCircuit.principalCategory = principalCategory;
		if (!categories.find((category) => category.id === principalCategory.id)) {
			categories.push(principalCategory);
		}
		aCircuit.categories = categories;
		validateCircuit(aCircuit);

		const aCircuitEntity = await this.circuitRepository.create(aCircuit);

		return aCircuitEntity;
	}
}

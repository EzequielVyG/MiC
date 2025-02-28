import { Inject, Injectable } from '@nestjs/common';
import { Circuit } from '../model/circuit.entity';
import { ICircuitRepository } from '../port/iCircuitRepository';
import { IFindCircuits } from '../port/iFindCircuits';


@Injectable()
export class FindCircuits implements IFindCircuits {
	constructor(
		@Inject(ICircuitRepository)
		private readonly circuitRepository: ICircuitRepository
	) {}

	async findAll(): Promise<Circuit[]> {
		return this.circuitRepository.findAll();
	}

	async findByName(name: string): Promise<Circuit> {
		return this.circuitRepository.findByName(name);
	}

	async findById(id: string): Promise<Circuit> {
		return this.circuitRepository.findById(id);
	}
}

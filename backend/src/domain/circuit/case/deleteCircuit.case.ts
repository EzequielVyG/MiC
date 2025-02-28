import { Inject, Injectable } from '@nestjs/common';
import { Circuit } from '../model/circuit.entity';
import { ICircuitRepository } from '../port/iCircuitRepository';
import { IDeleteCircuit } from '../port/iDeleteCircuit';

@Injectable()
export class DeleteCircuit implements IDeleteCircuit {
	constructor(
		@Inject(ICircuitRepository)
		private readonly circuitRepository: ICircuitRepository
	) {}

	async delete(id: string): Promise<Circuit> {
		return this.circuitRepository.delete(id);
	}
}

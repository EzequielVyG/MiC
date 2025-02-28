import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from 'src/domain/category/port/iCategoryRepository';
import { IFindByCategory } from '../port/iFindByCategory';
import { ICircuitRepository } from '../port/iCircuitRepository';
import { Circuit } from '../model/circuit.entity';

@Injectable()
export class FindByCategory implements IFindByCategory {
	constructor(
		@Inject(ICircuitRepository)
		private readonly circuitRepository: ICircuitRepository,
		@Inject(ICategoryRepository)
		private readonly categoryRepository: ICategoryRepository
	) {}

	async findAll(id: string): Promise<Circuit[]> {
		const aCategory = await this.categoryRepository.findByID(id);
		return this.circuitRepository.findByCategory(aCategory);
	}
}

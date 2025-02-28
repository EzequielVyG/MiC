import { Inject, Injectable } from '@nestjs/common';
import { Accesibility } from '../model/accesibility.entity';
import { IAccesibilityRepository } from '../port/iAccesibilityRepository';
import { IFindAccesibility } from '../port/iFindAccesibilities';

@Injectable()
export class FindAccesibilities implements IFindAccesibility {
	constructor(
		@Inject(IAccesibilityRepository)
		private readonly accesibilityRepository: IAccesibilityRepository
	) {}

	async findAll(): Promise<Accesibility[]> {
		return this.accesibilityRepository.findAll();
	}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accesibility as DomainAccesibility } from 'src/domain/accesibility/model/accesibility.entity';
import { IAccesibilityRepository } from 'src/domain/accesibility/port/iAccesibilityRepository';
import {
	Accesibility as TypeORMAccesibility
} from 'src/infrastructure/accesibility/typeorm/model/accesibility.entity';
import { Repository } from 'typeorm';
import { AccesibilityMapper } from '../mapper/accesibility-typeorm.mapper';

@Injectable()
export class AccesibilityRepository implements IAccesibilityRepository {
	constructor(
		@InjectRepository(TypeORMAccesibility)
		private readonly accesibilityRepository: Repository<TypeORMAccesibility>,
	) { }

	async findAll(): Promise<DomainAccesibility[]> {
		const accesibilities: TypeORMAccesibility[] = await this.accesibilityRepository.find({
		});

		return accesibilities.map((accesibility) => AccesibilityMapper.toDomain(accesibility));
	}
}

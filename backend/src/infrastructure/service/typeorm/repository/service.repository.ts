import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service as DomainService } from 'src/domain/service/model/service.entity';
import { IServiceRepository } from 'src/domain/service/port/iServiceRepository';
import {
	Service as TypeORMService
} from 'src/infrastructure/service/typeorm/model/service.entity';
import { Repository } from 'typeorm';
import { ServiceMapper } from '../mapper/service-typeorm.mapper';

@Injectable()
export class ServiceRepository implements IServiceRepository {
	constructor(
		@InjectRepository(TypeORMService)
		private readonly serviceRepository: Repository<TypeORMService>,
	) { }

	async findAll(): Promise<DomainService[]> {
		const services: TypeORMService[] = await this.serviceRepository.find({
		});

		return services.map((service) => ServiceMapper.toDomain(service));
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { Service } from '../model/service.entity';
import { IFindService } from '../port/iFindServices';
import { IServiceRepository } from '../port/iServiceRepository';

@Injectable()
export class FindServices implements IFindService {
	constructor(
		@Inject(IServiceRepository)
		private readonly serviceRepository: IServiceRepository
	) {}

	async findAll(): Promise<Service[]> {
		return this.serviceRepository.findAll();
	}
}

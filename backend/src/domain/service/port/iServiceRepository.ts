import { Service } from '../model/service.entity';

export interface IServiceRepository {
	findAll(): Promise<Service[]>;
}

export const IServiceRepository = Symbol('IServiceRepository');

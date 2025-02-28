import { Service } from '../model/service.entity';

export interface IFindService {
	findAll(): Promise<Service[]>;
}

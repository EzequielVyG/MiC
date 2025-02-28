import { Circuit } from '../model/circuit.entity';

export interface IFindByCategory {
	findAll(categoryId: string): Promise<Circuit[]>;
}

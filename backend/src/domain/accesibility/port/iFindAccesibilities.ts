import { Accesibility } from '../model/accesibility.entity';

export interface IFindAccesibility {
	findAll(): Promise<Accesibility[]>;
}

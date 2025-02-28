import { Category } from '../model/category.entity';

export interface IFindPrincipalCategories {
	findAll(): Promise<Category[]>;
	findAllPlaces(): Promise<Category[]>;
	findAllEvents(): Promise<Category[]>;
}

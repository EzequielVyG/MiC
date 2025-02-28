import { Category } from '../model/category.entity';

export interface ICategoryRepository {
	findAll(): Promise<Category[]>;
	findByID(id: string): Promise<Category>;
	findAllByIds(ids: string[]): Promise<Category[]>;
	findByFather(father: Category | null): Promise<Category[]>;
	findByFatherAndGroups(
		father: Category | null,
		groups: string[]
	): Promise<Category[]>;
	create(aCategory: Category): Promise<Category>;
	update(aCategory: Category): Promise<Category>;
	findAllEvent(): Promise<Category[]>;
	findAllNotEvent(): Promise<Category[]>;
	findAllWithPlaces(): Promise<Category[]>;
	findAllWithVigentEvents(): Promise<Category[]>;
	findAllWithCircuits(): Promise<Category[]>;
}

export const ICategoryRepository = Symbol('ICategoryRepository');

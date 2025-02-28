import { Category } from '../model/category.entity';

export interface IFindAllEvent {
	findAll(): Promise<Category[]>;
}

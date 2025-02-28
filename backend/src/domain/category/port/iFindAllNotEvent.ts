import { Category } from '../model/category.entity';

export interface IFindAllNotEvent {
	findAll(): Promise<Category[]>;
}

import { Category } from '../model/category.entity';

export interface IfindAllCategory {
	findAll(): Promise<Category[]>;
}

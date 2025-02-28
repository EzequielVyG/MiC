import { Category } from '../model/category.entity';

export interface IfindCategoryByFather {
	findByFather(father: Category): Promise<Category[]>;
}

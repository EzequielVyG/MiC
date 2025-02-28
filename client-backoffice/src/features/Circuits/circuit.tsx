import { Category } from '../../features/Categories/category';
import { Place } from '../../features/Places/place';

export interface Circuit {
	id?: string;
	name: string;
	description: string;
	places: Place[];
	principalCategory: Category;
	categories: Category[];
}

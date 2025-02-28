import { Category } from '../../../../client/src/features/Categories/category';
import { Place } from '../../../../client/src/features/Places/place';

export interface Circuit {
	id?: string;
	name: string;
	description: string;
	places: Place[];
	principalCategory: Category;
	categories: Category[];
}

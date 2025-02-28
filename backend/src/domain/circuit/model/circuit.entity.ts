import { Category } from 'src/domain/category/model/category.entity';
import { Place } from 'src/domain/place/model/place.entity';

export class Circuit {
    id: string;

    name: string;

    description: string;

    places: Place[];

    principalCategory: Category;

    categories: Category[]
}

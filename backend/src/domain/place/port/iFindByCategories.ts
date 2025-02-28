import { Place } from '../model/place.entity';

export interface IFindByCategories {
    findAll(categoriesId: string[], lat: number, lng: number): Promise<Place[]>;
}

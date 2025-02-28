import { Place } from '../model/place.entity';

export interface IFindByCategory {
	findAll(categoryId: string, lat: number, lng: number): Promise<Place[]>;
}

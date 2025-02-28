import { Place } from '../model/place.entity';

export interface IDeletePlace {
	delete(name: string): Promise<Place>;
}

import { Location } from '../model/place-location';
import { Place } from '../model/place.entity';

export interface IFindByDistance {
	findAll(punto: Location): Promise<Place[]>;
}

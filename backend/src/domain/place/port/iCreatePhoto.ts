import { PlacePhoto } from '../model/place-photo.entity';
import { Place } from '../model/place.entity';

export interface ICreatePhoto {
	create(photoUrl: string, place: Place): Promise<PlacePhoto>;
}

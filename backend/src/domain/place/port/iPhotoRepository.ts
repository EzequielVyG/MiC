import { PlacePhoto } from '../model/place-photo.entity';
import { Place } from '../model/place.entity';

export interface IPhotoRepository {
	create(aPhoto: PlacePhoto, aPlace: Place): Promise<PlacePhoto>;
}

export const IPhotoRepository = Symbol('IPhotoRepository');

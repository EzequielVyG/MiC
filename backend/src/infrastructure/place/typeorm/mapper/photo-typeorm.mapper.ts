import { PlacePhoto as TypeORMPlacePhoto } from '../model/place-photo.entity';
import { PlacePhoto as DomainPlacePhoto } from 'src/domain/place/model/place-photo.entity';
import { PlaceMapper } from './place-typeorm.mapper';
import { Place as DomainPlace } from 'src/domain/place/model/place.entity';

export class PhotoMapper {
	static toDomain(photo: TypeORMPlacePhoto): DomainPlacePhoto {
		return {
			id: photo.id,
			photoUrl: photo.photoUrl,
			//place: PlaceMapper.toDomain(photo.place),
		};
	}

	static toTypeORM(
		photo: DomainPlacePhoto,
		aPlace: DomainPlace
	): TypeORMPlacePhoto {
		const typeORMPhoto = new TypeORMPlacePhoto();
		typeORMPhoto.id = photo.id;
		typeORMPhoto.photoUrl = photo.photoUrl;
		typeORMPhoto.place = PlaceMapper.toTypeORM(aPlace);
		return typeORMPhoto;
	}
}

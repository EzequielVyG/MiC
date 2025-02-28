import { Injectable, Inject } from '@nestjs/common';
import { ICreatePhoto } from '../port/iCreatePhoto';
import { Place } from '../model/place.entity';
import { PlacePhoto } from '../model/place-photo.entity';
import { IPhotoRepository } from '../port/iPhotoRepository';

require('dotenv').config();

@Injectable()
export class CreatePhoto implements ICreatePhoto {
	constructor(
		@Inject(IPhotoRepository)
		private photoRepository: IPhotoRepository
	) {}

	async create(photoUrl: string, place: Place): Promise<PlacePhoto> {
		const aPhoto = new PlacePhoto();
		aPhoto.photoUrl = photoUrl;

		const aPhotoEntity = await this.photoRepository.create(aPhoto, place);

		return aPhotoEntity;
	}
}

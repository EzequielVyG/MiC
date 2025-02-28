import { Inject, Injectable } from '@nestjs/common';
import { ICreatePlace } from '../port/iCreatePlace';

import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { Location } from '../model/place-location';
import { PlacePhoto } from '../model/place-photo.entity';
import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';
import { IPlaceRepository } from '../port/iPlaceRepository';

import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from '../model/accesibility.entity';
import { Service } from '../model/service.entity';
import { validatePlace } from './validation';
import { ImagesProcessorService } from 'src/util/images-processor.service';
const ImagesProcessor = new ImagesProcessorService();


@Injectable()
export class CreatePlace implements ICreatePlace {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository,
	) { }

	async create(
		name: string,
		description: string,
		note: string,
		schedules: PlaceSchedule[],
		photos: PlacePhoto[],
		principalCategory: Category,
		categories: Category[],
		url: string,
		cmi: string,
		phone: string,
		domicile: string,
		location: Location,
		origin: string,
		minors: string,
		accessibilities: Accessibility[],
		services: Service[],
		organization: Organization,
		files: MulterFile[],
		facebook_url: string,
		twitter_url: string,
		instagram_url: string
	): Promise<Place> {
		const aPlace = new Place();
		aPlace.name = name;
		aPlace.description = description;
		aPlace.note = note;
		aPlace.schedules = schedules;
		aPlace.photos = photos;
		aPlace.principalCategory = principalCategory;

		if (!categories.find((category) => category.id === principalCategory.id)) {
			categories.push(principalCategory);
		}

		aPlace.categories = categories;
		aPlace.url = url;
		aPlace.cmi = cmi;
		aPlace.phone = phone;
		aPlace.domicile = domicile;
		aPlace.location = location;
		aPlace.origin = origin;
		aPlace.minors = minors;
		aPlace.accessibilities = accessibilities;
		aPlace.services = services;
		aPlace.organization = organization;
		aPlace.facebook_url = facebook_url;
		aPlace.twitter_url = twitter_url;
		aPlace.instagram_url = instagram_url;

		files = await ImagesProcessor.resizeMultiplesImages(files);

		validatePlace(aPlace);
		aPlace.photos = aPlace.photos.length > 0 ? aPlace.photos : null;
		const aPlaceEntity = await this.placeRepository.create(aPlace, files);

		return aPlaceEntity;
	}
}

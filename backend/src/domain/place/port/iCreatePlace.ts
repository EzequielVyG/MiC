import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from '../model/accesibility.entity';
import { Location } from '../model/place-location';
import { PlacePhoto } from '../model/place-photo.entity';
import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';
import { Service } from '../model/service.entity';

export interface ICreatePlace {
	create(
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
		instagram_url: string,
	): Promise<Place>;
}

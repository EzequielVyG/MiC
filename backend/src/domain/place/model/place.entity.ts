import { Category } from 'src/domain/category/model/category.entity';
import { Event } from 'src/domain/event/model/event.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from './accesibility.entity';
import { Location } from './place-location';
import { PlacePhoto } from './place-photo.entity';
import { PlaceSchedule } from './place-schedule.entity';
import { Service } from './service.entity';

export class Place {
	id: string;
	name: string;
	description: string;
	note: string;
	schedules: PlaceSchedule[];
	photos: PlacePhoto[];
	principalCategory: Category;
	categories: Category[];
	url: string;
	cmi: string;
	phone: string;
	domicile: string;
	location: Location;
	origin: string;
	minors: string;
	accessibilities: Accessibility[];
	services: Service[];
	organization: Organization;
	facebook_url: string;
	twitter_url: string;
	instagram_url: string;
	events?: Event[];
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

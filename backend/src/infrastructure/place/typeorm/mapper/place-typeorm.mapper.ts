import { Place as DomainPlace } from '../../../../domain/place/model/place.entity';
import { Place as TypeORMPlace } from '../model/place.entity';

import { PlacePhoto as DomainPlacePhoto } from '../../../../domain/place/model/place-photo.entity';
import { PlacePhoto as TypeORMPlacePhoto } from '../model/place-photo.entity';

import { Category as DomainCategory } from 'src/domain/category/model/category.entity';
import { Accessibility as DomainAccessibility } from 'src/domain/place/model/accesibility.entity';
import { PlaceSchedule as DomainPlaceSchedule } from 'src/domain/place/model/place-schedule.entity';
import { Service as DomainService } from 'src/domain/place/model/service.entity';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';
import { Category as TypeORMCategory } from 'src/infrastructure/category/typeorm/model/category.entity';
import { EventMapper } from 'src/infrastructure/event/typeorm/mapper/event-typeorm.mapper';
import { OrganizationMapper } from 'src/infrastructure/organization/typeorm/mapper/organization-typeorm.mapper';
import { Accessibility as TypeORMAccessibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';
import { Service as TypeORMService } from 'src/infrastructure/place/typeorm/model/service.entity';
import { DayOfWeek as DomainDayOfWeek } from '../../../../domain/place/model/day-of-week.entity';
import { DayOfWeek as TypeORMDayOfWeek } from '../model/day-of-week.entity';
import { PlaceSchedule as TypeORMPlaceSchedule } from '../model/place-schedule.entity';

export class PlaceMapper {
	static toDomain(place: TypeORMPlace): DomainPlace {
		return {
			id: place.id,
			name: place.name || '',
			description: place.description || '',
			note: place.note || '',
			schedules: place.schedules
				? place.schedules.map((schedule) => this.scheduleToDomain(schedule))
				: [],
			photos: place.photos
				? place.photos.map((photo) => this.photoToDomain(photo))
				: [],
			principalCategory: place.principalCategory
				? place.principalCategory
				: null,
			categories: place.categories
				? place.categories.map((category) =>
					CategoryMapper.toDomain(category)
				)
				: [],
			url: place.url || '',
			facebook_url: place.facebook_url || '',
			twitter_url: place.twitter_url || '',
			instagram_url: place.instagram_url || '',
			cmi: place.cmi || '',
			phone: place.phone || '',
			domicile: place.domicile || '',
			origin: place.origin || '',
			location: {
				lat: place.location?.coordinates[1] || null,
				lng: place.location?.coordinates[0] || null,
			},
			minors: place.minors,
			organization: place.organization ? OrganizationMapper.toDomain(place.organization) : null,
			accessibilities: place.accessibilities
				? place.accessibilities.map((accessibility) =>
					this.accessibilityToDomain(accessibility)
				)
				: [],
			services: place.services
				? place.services.map((service) => this.serviceToDomain(service))
				: [],
			events: place.events ? place.events.map((aEvent) => EventMapper.toDomain(aEvent)) : [],
			createdAt: place.createdAt,
			updatedAt: place.updatedAt,
			deletedAt: place.deletedAt || null,
			// Aquí puedes mapear las propiedades adicionales según necesites
		};
	}

	static toTypeORM(domainPlace: DomainPlace): TypeORMPlace {
		const typeORMPlace = new TypeORMPlace();
		typeORMPlace.id = domainPlace.id;
		typeORMPlace.name = domainPlace.name || '';
		typeORMPlace.description = domainPlace.description || '';
		typeORMPlace.note = domainPlace.note || '';
		typeORMPlace.schedules = domainPlace.schedules
			? domainPlace.schedules.map((schedule) =>
				this.scheduleToTypeORM(schedule)
			)
			: [];
		typeORMPlace.photos = domainPlace.photos
			? domainPlace.photos.map((photo) => this.photoToTypeORM(photo))
			: [];
		typeORMPlace.categories = domainPlace.categories
			? domainPlace.categories.map((category) =>
				this.categoryToTypeORM(category)
			)
			: [];
		typeORMPlace.url = domainPlace.url || '';
		(typeORMPlace.facebook_url = domainPlace.facebook_url || ''),
			(typeORMPlace.twitter_url = domainPlace.twitter_url || ''),
			(typeORMPlace.instagram_url = domainPlace.instagram_url || ''),
			(typeORMPlace.cmi = domainPlace.cmi || '');
		(typeORMPlace.phone = domainPlace.phone || '');
		typeORMPlace.domicile = domainPlace.domicile || '';
		typeORMPlace.origin = domainPlace.origin || '';
		typeORMPlace.location = {
			type: 'Point',
			coordinates: [
				domainPlace.location?.lng || 0,
				domainPlace.location?.lat || 0,
			],
		};
		typeORMPlace.minors = domainPlace.minors || '';
		typeORMPlace.organization = domainPlace.organization ? OrganizationMapper.toTypeORM(domainPlace.organization) : null;
		typeORMPlace.accessibilities = domainPlace.accessibilities
			? domainPlace.accessibilities.map((accesibility) =>
				this.accessibilityToTypeORM(accesibility)
			)
			: [];
		typeORMPlace.services = domainPlace.services
			? domainPlace.services.map((service) => this.serviceToTypeORM(service))
			: [];
		typeORMPlace.createdAt = domainPlace.createdAt;
		typeORMPlace.updatedAt = domainPlace.updatedAt;
		typeORMPlace.deletedAt = domainPlace.deletedAt || null;
		return typeORMPlace;
	}

	private static scheduleToDomain(
		schedule: TypeORMPlaceSchedule
	): DomainPlaceSchedule {
		return {
			id: schedule.id,
			dayOfWeek: this.dayOfWeekToDomain(schedule.dayOfWeek),
			openingHour: schedule.openingHour,
			closingHour: schedule.closingHour,
		};
	}

	private static scheduleToTypeORM(
		schedule: DomainPlaceSchedule
	): TypeORMPlaceSchedule {
		const typeORMSchedule = new TypeORMPlaceSchedule();
		typeORMSchedule.id = schedule.id;
		typeORMSchedule.dayOfWeek = this.dayOfWeekToTypeORM(schedule.dayOfWeek);
		typeORMSchedule.openingHour = schedule.openingHour;
		typeORMSchedule.closingHour = schedule.closingHour;
		return typeORMSchedule;
	}

	private static accessibilityToTypeORM(
		accesibility: DomainAccessibility
	): TypeORMAccessibility {
		const typeORMAccessibility = new TypeORMAccessibility();
		typeORMAccessibility.id = accesibility.id;
		typeORMAccessibility.name = accesibility.name;
		return typeORMAccessibility;
	}

	private static accessibilityToDomain(
		accesibility: TypeORMAccessibility
	): DomainAccessibility {
		return {
			id: accesibility.id,
			name: accesibility.name,
		};
	}

	private static serviceToTypeORM(service: DomainService): TypeORMService {
		const typeORMService = new TypeORMService();
		typeORMService.id = service.id;
		typeORMService.name = service.name;
		return typeORMService;
	}

	private static serviceToDomain(service: TypeORMService): DomainService {
		return {
			id: service.id,
			name: service.name,
		};
	}

	private static categoryToDomain(category: TypeORMCategory) {
		const domainCategory = new DomainCategory();
		domainCategory.id = category.id;
		domainCategory.name = category.name;
		domainCategory.father = category.father
			? this.categoryToDomain(category.father)
			: null;
		return domainCategory;
	}

	private static categoryToTypeORM(category: DomainCategory) {
		const typeORMCategory = new TypeORMCategory();
		typeORMCategory.id = category.id;
		typeORMCategory.name = category.name;
		typeORMCategory.father = category.father
			? this.categoryToTypeORM(category.father)
			: null;

		return typeORMCategory;
	}

	private static photoToDomain(photo: TypeORMPlacePhoto): DomainPlacePhoto {
		return {
			id: photo.id,
			photoUrl: photo.photoUrl,
			//place: this.toDomain(aPlace),
		};
	}

	private static photoToTypeORM(photo: DomainPlacePhoto): TypeORMPlacePhoto {
		const typeORMPhoto = new TypeORMPlacePhoto();
		//aPlace.photos = [];
		typeORMPhoto.id = photo.id;
		typeORMPhoto.photoUrl = photo.photoUrl;
		return typeORMPhoto;
	}

	private static dayOfWeekToDomain(
		dayOfWeek: TypeORMDayOfWeek
	): DomainDayOfWeek {
		return {
			id: dayOfWeek.id,
			name: dayOfWeek.name,
		};
	}

	private static dayOfWeekToTypeORM(
		dayOfWeek: DomainDayOfWeek
	): TypeORMDayOfWeek {
		const typeORMDayOfWeek = new TypeORMDayOfWeek();
		typeORMDayOfWeek.id = dayOfWeek.id;
		typeORMDayOfWeek.name = dayOfWeek.name;
		return typeORMDayOfWeek;
	}
}

import { EventParticipant as DomainEventParticipant } from 'src/domain/event/model/event-participant.entity';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';
import { OrganizationMapper } from 'src/infrastructure/organization/typeorm/mapper/organization-typeorm.mapper';
import { PlaceMapper } from 'src/infrastructure/place/typeorm/mapper/place-typeorm.mapper';
import { UserMapper } from 'src/infrastructure/user/typeorm/mapper/user-typeorm.mapper';
import { EventFlyer as DomainEventFlyer } from '../../../../domain/event/model/event-flyer.entity';
import { EventPhoto as DomainEventPhoto } from '../../../../domain/event/model/event-photo.entity';
import { Event as DomainEvent } from '../../../../domain/event/model/event.entity';
import { EventFlyer as TypeORMEventFlyer } from '../model/event-flyer.entity';
import { EventParticipant as TypeORMEventParticipant } from '../model/event-participant.entity';
import { EventPhoto as TypeORMEventPhoto } from '../model/event-photo.entity';
import { Event as TypeORMEvent } from '../model/event.entity';
import { EventFlyerMapper } from './event-flyer-typeorm.mapper';
import { EventPhotoMapper } from './event-photo-typeorm.mapper';

export class EventMapper {
	static toDomain(event: TypeORMEvent): DomainEvent {
		if (event) {
			try {
				const aDomEvent = {
					id: event.id,
					name: event.name,
					description: event.description || '',
					url: event.url || '',
					urlTicketera: event.urlTicketera || '',
					price: event.price || '',
					status: event.status || '',
					startDate: event.startDate || null,
					endDate: event.endDate || null,
					minors: event.minors,
					photos: event.photos
						? event.photos.map((photo) => EventPhotoMapper.toDomain(photo))
						: [],
					flyers: event.flyers
						? event.flyers.map((flyer) => EventFlyerMapper.toDomain(flyer))
						: [],
					categories: event.categories
						? event.categories.map((category) =>
							CategoryMapper.toDomain(category)
						)
						: [],
					creator: event.creator ? UserMapper.toDomain(event.creator) : null,
					place: event.place ? PlaceMapper.toDomain(event.place) : null,
					principalCategory: event.principalCategory
						? CategoryMapper.toDomain(event.principalCategory)
						: null,
					origin: event.origin,
					participants: event.participants
						? event.participants.map((participant) =>
							this.participantToDomain(participant)
						)
						: [],
				};
				return aDomEvent;
			} catch (error) {
			}
		}
	}

	static toTypeORM(domainEvent: DomainEvent): TypeORMEvent {
		const typeORMEvent = new TypeORMEvent();
		typeORMEvent.id = domainEvent.id;
		typeORMEvent.name = domainEvent.name;
		typeORMEvent.description = domainEvent.description || '';
		typeORMEvent.url = domainEvent.url || '';
		typeORMEvent.urlTicketera = domainEvent.urlTicketera || '';
		typeORMEvent.price = domainEvent.price || '';
		typeORMEvent.status = domainEvent.status || '';
		typeORMEvent.startDate = domainEvent.startDate || null;
		typeORMEvent.endDate = domainEvent.endDate || null;
		typeORMEvent.minors = domainEvent.minors;
		typeORMEvent.photos = domainEvent.photos
			? domainEvent.photos.map((photo) => this.photoToTypeORM(photo))
			: [];
		typeORMEvent.flyers = domainEvent.flyers
			? domainEvent.flyers.map((flyer) => this.flyerToTypeORM(flyer))
			: [];
		typeORMEvent.creator = domainEvent.creator
			? UserMapper.toTypeORM(domainEvent.creator)
			: null;
		typeORMEvent.place = domainEvent.place
			? PlaceMapper.toTypeORM(domainEvent.place)
			: null;
		typeORMEvent.origin = domainEvent.origin;
		typeORMEvent.principalCategory = domainEvent.principalCategory
			? CategoryMapper.toTypeORM(domainEvent.principalCategory)
			: null;
		typeORMEvent.categories = domainEvent.categories
			? domainEvent.categories.map((category) =>
				CategoryMapper.toTypeORM(category)
			)
			: [];
		typeORMEvent.participants = domainEvent.participants
			? domainEvent.participants.map((participant) =>
				this.participantToTypeORM(participant)
			)
			: [];
		return typeORMEvent;
	}

	private static participantToDomain(
		participant: TypeORMEventParticipant
	): DomainEventParticipant {
		return {
			id: participant.id,
			event: EventMapper.toDomain(participant.event),
			organization: OrganizationMapper.toDomain(participant.organization),
			role: participant.role,
			status: participant.status,
		};
	}

	private static participantToTypeORM(
		participant: DomainEventParticipant
	): TypeORMEventParticipant {
		const typeORMParticipant = new TypeORMEventParticipant();
		typeORMParticipant.id = participant.id;
		typeORMParticipant.organization = OrganizationMapper.toTypeORM(
			participant.organization
		);
		typeORMParticipant.role = participant.role;
		typeORMParticipant.status = participant.status;
		return typeORMParticipant;
	}

	private static photoToTypeORM(photo: DomainEventPhoto): TypeORMEventPhoto {
		const typeORMPhoto = new TypeORMEventPhoto();
		typeORMPhoto.id = photo.id;
		typeORMPhoto.photoUrl = photo.photoUrl;
		return typeORMPhoto;
	}

	private static flyerToTypeORM(flyer: DomainEventFlyer): TypeORMEventFlyer {
		const typeORMFlyer = new TypeORMEventFlyer();
		typeORMFlyer.id = flyer.id;
		typeORMFlyer.flyerUrl = flyer.flyerUrl;
		return typeORMFlyer;
	}
}

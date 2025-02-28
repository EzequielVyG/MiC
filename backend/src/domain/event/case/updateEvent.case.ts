import { Inject, Injectable } from '@nestjs/common';
import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
import { Place } from 'src/domain/place/model/place.entity';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import { EventParticipant } from '../model/event-participant.entity';
import { EventPhoto } from '../model/event-photo.entity';
import { EventFlyer } from '../model/event-flyer.entity';
import { EventStatus } from '../model/event-status.enum';
import { Event } from '../model/event.entity';
import { IEventRepository } from '../port/iEventRepository';
import { IPhotoRepository } from '../port/iPhotoRepository';
import { IFlyerRepository } from '../port/iFlyerRepository';
import { IUpdateEvent } from '../port/iUpdateEvent';
import { getEventStatus } from './getEventStatus';
import { ImagesProcessorService } from 'src/util/images-processor.service';
const ImagesProcessor = new ImagesProcessorService();

@Injectable()
export class UpdateEvent implements IUpdateEvent {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository,
		@Inject(IEventRepository)
		private readonly eventRepository: IEventRepository,
		@Inject(IPhotoRepository)
		private photoRepository: IPhotoRepository,
		@Inject(IFlyerRepository)
		private flyerRepostitory: IFlyerRepository,
		@Inject(IOrganizationRepository)
		private readonly organizationRepository: IOrganizationRepository,
		private readonly createNotification: CreateNotification
	) { }

	async update(id: string,
		name: string,
		description: string,
		minors: string,
		place: Place,
		principalCategory: Category,
		categories: Category[],
		startDate: string,
		endDate: string,
		price: string,
		photos: EventPhoto[],
		flyers: EventFlyer[],
		url: string,
		files: MulterFile[],
		isDraft: boolean,
		participants: EventParticipant[],
		urlTicketera: string
	): Promise<Event> {
		const aEvent: Event = await this.eventRepository.findById(id);
		if (!aEvent) {
			throw new Error("El evento a actualizar no existe")
		}

		aEvent.name = name
		aEvent.description = description
		aEvent.startDate = startDate ? new Date(startDate) : null
		aEvent.endDate = endDate ? new Date(endDate) : null
		aEvent.price = price
		aEvent.url = url
		aEvent.photos = photos
		aEvent.flyers = flyers
		aEvent.minors = minors
		aEvent.principalCategory = principalCategory
		aEvent.categories = categories
		aEvent.place = place
		aEvent.participants = participants
		aEvent.urlTicketera = urlTicketera;
		// const placeOrganization = aEvent.place && aEvent.place.organization ? await this.organizationRepository.findByID(aEvent.place.organization.id) : null

		if (!categories.find((category) => category.id === principalCategory.id)) {
			categories.push(principalCategory);
		}

		aEvent.categories = categories;
		aEvent.place = place;
		aEvent.participants = participants;
		// const placeOrganization = aEvent.place && aEvent.place.organization ? await this.organizationRepository.findByID(aEvent.place.organization.id) : null

		// validateEvent(aEvent, placeOrganization);
		if (name === '') {
			throw new Error('El nombre del evento es requerido');
		}

		if (!isDraft && !aEvent.place) {
			throw new Error('Lugar de evento requerido');
		}

		const hasOrganizator = aEvent.participants.some(
			(aParticipant) => aParticipant.role === 'Organizador'
		);
		if (!isDraft && !hasOrganizator) {
			throw new Error('El evento debe tener al menos un organizador');
		}

		//booleana mio es para saber si el lugar de la organizacion es mio o no
		let mio = false;

		files = await ImagesProcessor.resizeMultiplesImages(files);

		// si llega a este if SIN place es un evento Draft si o si
		if (aEvent.place) {
			if (!aEvent.place.organization) {
				mio = true;
			} else {
				const org = await this.organizationRepository.findByID(
					aEvent.place.organization.id
				);
				if (
					org.owner.id === aEvent.creator.id ||
					org.operators.some((operador) => operador.id === aEvent.creator.id)
				) {
					mio = true;
				}
			}
		}

		let aEventEntity: Event;
		if (!isDraft && place.organization) {
			aEvent.status = getEventStatus(
				aEvent.startDate,
				aEvent.endDate,
				isDraft,
				mio
			);
			aEventEntity = await this.eventRepository.update(aEvent, files);

			if (aEventEntity && aEventEntity.status === EventStatus.PENDING) {
				const participant = aEvent.participants.find(
					(participant: EventParticipant) => participant.role === 'Organizador'
				);
				const title = 'Solicitud de evento';
				const description = `La organización ${participant.organization.legalName} solicita organizar un evento en tu lugar ${aEventEntity.place.name}.`;
				const link = `/request/events/${aEventEntity.id}`;
				await this.createNotification.createByOrganization(
					title,
					description,
					link,
					aEventEntity.place.organization
				);
			}
		} else {
			aEvent.status = getEventStatus(
				aEvent.startDate,
				aEvent.endDate,
				isDraft,
				mio
			);
			aEventEntity = await this.eventRepository.update(aEvent, files);
		}

		return aEventEntity;
	}

	async cancel(id: string): Promise<Event> {
		const aEvent: Event = await this.eventRepository.findById(id);
		if (!aEvent) {
			throw new Error('El evento a actualizar no existe');
		}
		aEvent.status = EventStatus.CANCELED;

		const aEventEntity = await this.eventRepository.update(aEvent, []);

		return aEventEntity;
	}
}

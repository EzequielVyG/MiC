import { Inject, Injectable } from '@nestjs/common';
import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
import { Place } from 'src/domain/place/model/place.entity';
/* import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository'; */
import { OrganizationStatus } from 'src/domain/organization/model/status.enum';
import { User } from 'src/domain/user/model/user.entity';
import { EventParticipant } from '../model/event-participant.entity';
import { EventStatus } from '../model/event-status.enum';
import { Event } from '../model/event.entity';
import { ICreateEvent } from '../port/iCreateEvent';
import { IEventRepository } from '../port/iEventRepository';
import { getEventStatus } from './getEventStatus';

import { ImagesProcessorService } from 'src/util/images-processor.service';
const ImagesProcessor = new ImagesProcessorService();

@Injectable()
export class CreateEvent implements ICreateEvent {
	constructor(
		@Inject(IEventRepository)
		private readonly eventRepository: IEventRepository,
		/* @Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository, */
		@Inject(IOrganizationRepository)
		private readonly organizationRepository: IOrganizationRepository,
		private readonly createNotification: CreateNotification
	) { }

	async create(
		name: string,
		description: string,
		minors: string,
		place: Place,
		principalCategory: Category,
		categories: Category[],
		creator: User,
		startDate: string,
		endDate: string,
		price: string,
		url: string,
		origin: string,
		files: MulterFile[],
		isDraft: boolean,
		participants: EventParticipant[],
		urlTicketera: string,
	): Promise<Event> {
		try {
			const aEvent = new Event();
			aEvent.name = name;
			aEvent.description = description;
			aEvent.principalCategory = principalCategory;

			if (
				!categories.find((category) => category.id === principalCategory.id)
			) {
				categories.push(principalCategory);
			}

			aEvent.categories = categories;
			aEvent.startDate = startDate ? new Date(startDate) : null;
			aEvent.endDate = endDate ? new Date(endDate) : null;
			aEvent.price = price;
			aEvent.url = url;
			aEvent.minors = minors;
			aEvent.origin = origin;
			aEvent.creator = creator;
			aEvent.place = place;
			aEvent.participants = participants;
			aEvent.urlTicketera = urlTicketera;

			if (name === '') {
				throw new Error('El nombre del evento es requerido');
			}

			if (!isDraft && !aEvent.principalCategory) {
				throw new Error('Categoría principal requerida');
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

			// si llega a este if SIN place es un evento Draft si o si
			let org;

			files = await ImagesProcessor.resizeMultiplesImages(files);


			if (aEvent.place) {
				if (!aEvent.place.organization) {
					mio = true;
				} else {
					org = await this.organizationRepository.findByID(
						aEvent.place.organization.id
					);
					if (aEvent.place.organization.status === OrganizationStatus.DELETED) {
						mio = true;
					} else {
						if (
							org.owner.id === aEvent.creator.id ||
							org.operators.findIndex(
								(operador) => operador.user.id === aEvent.creator.id
							) !== -1
						) {
							mio = true;
						}
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
				aEventEntity = await this.eventRepository.create(aEvent, files);

				if (aEventEntity && aEventEntity.status === EventStatus.PENDING) {
					const participant = aEvent.participants.find(
						(participant: EventParticipant) =>
							participant.role === 'Organizador'
					);
					const title = 'Solicitud de evento';
					const description = `La organización ${participant.organization.legalName} solicita organizar un evento en tu lugar ${aEventEntity.place.name}.`;
					const link = `/request/events/${aEventEntity.id}`;
					await this.createNotification.createByOrganization(
						title,
						description,
						link,
						org
					);
				}
			} else {
				aEvent.status = getEventStatus(
					aEvent.startDate,
					aEvent.endDate,
					isDraft,
					mio
				);
				aEventEntity = await this.eventRepository.create(aEvent, files);
			}

			return aEventEntity;
		} catch (error) {
			console.log(
				'🚀 ~ file: createEvent.case.ts:50 ~ CreateEvent ~ error:',
				error
			);
		}
	}
}

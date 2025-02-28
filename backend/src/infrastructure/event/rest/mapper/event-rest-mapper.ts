import { EventStatus } from 'src/domain/event/model/event-status.enum';
import { CategoryRestMapper } from 'src/infrastructure/category/rest/mapper/category-rest-mapper';
import { PlaceRestMapper } from 'src/infrastructure/place/rest/mapper/place-rest-mapper';
import { UserRestMapper } from 'src/infrastructure/user/rest/mapper/user-rest-mapper';
import { Event } from '../../../../domain/event/model/event.entity';
import { EventPayload } from '../payload/event-payload';

const EventStatusMap: { [key in EventStatus]: string } = {
	[EventStatus.CANCELED]: 'Cancelado',
	[EventStatus.DRAFT]: 'Borrador',
	/* [EventStatus.FINISHED]: 'Finalizado',
	[EventStatus.IN_PROGRESS]: 'En progreso',
	[EventStatus.POSTPONED]: 'Pospuesto', */
	[EventStatus.SCHEDULED]: 'Programado',
	[EventStatus.PENDING]: 'Pendiente',
};

export const EventStatusMessageMap: { [key in EventStatus]: string } = {
	[EventStatus.CANCELED]: 'Evento cancelado',
	[EventStatus.DRAFT]: 'Borrador hasta ser programado',
	[EventStatus.SCHEDULED]: 'Programado con exito',
	[EventStatus.PENDING]: 'Pendiente de aceptación por la organización dueña del lugar',
};
export class EventRestMapper {
	static toPayload(event: Event): EventPayload {
		return {
			id: event.id,
			name: event.name,
			description: event.description,
			url: event.url,
			minors: event.minors,
			price: event.price,
			startDate: event.startDate,
			endDate: event.endDate,
			creator: event.creator ? UserRestMapper.toPayload(event.creator) : null,
			place: event.place ? PlaceRestMapper.toPayload(event.place) : null,
			photos: event.photos,
			flyers: event.flyers,
			status: EventStatusMap[event.status as EventStatus],
			principalCategory: event.principalCategory
				? CategoryRestMapper.toPayload(event.principalCategory)
				: null,
			categories: event.categories
				? event.categories.map((category) =>
					CategoryRestMapper.toPayload(category)
				)
				: [],
			participants: event.participants,
			urlTicketera: event.urlTicketera
		};
	}
}

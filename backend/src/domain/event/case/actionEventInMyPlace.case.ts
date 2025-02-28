import { Inject, Injectable } from '@nestjs/common';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import { EventStatus } from '../model/event-status.enum';
import { Event } from '../model/event.entity';
import { IActionEventInMyPlace } from '../port/iActionEventInMyPlace';
import { IEventRepository } from '../port/iEventRepository';
import { getEventStatus } from './getEventStatus';

@Injectable()
export class ActionEventInMyPlace implements IActionEventInMyPlace {

    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository,
        @Inject(IPlaceRepository)
        private readonly placeRepository: IPlaceRepository,
        private readonly createNotification: CreateNotification,
    ) {
    }

    async accept(id: string): Promise<Event> {
        const aEventToAccept = await this.eventRepository.findById(id);
        if (!aEventToAccept) {
            throw new Error("El evento a aceptar no existe")
        }

        if (aEventToAccept.status !== EventStatus.PENDING) {
            throw new Error("El evento ya no esta pendiente de aceptacion")
        }

        aEventToAccept.status = getEventStatus(aEventToAccept.startDate, aEventToAccept.endDate, false, true)
        const aEventEntity = await this.eventRepository.update(aEventToAccept, [])

        const notificationBody = {
            title: "Evento aceptado",
            description: `La organización ${aEventToAccept.place.organization.legalName} ha aceptado tu evento en el lugar ${aEventToAccept.place.name}.`,
            link: null,
            receiver: aEventToAccept.creator
        }

        await this.createNotification.createByUser(notificationBody.title, notificationBody.description, notificationBody.link, notificationBody.receiver)

        return aEventEntity
    }
    async reject(id: string, reason: string): Promise<Event> {
        const aEventToReject = await this.eventRepository.findById(id);

        if (!aEventToReject) {
            throw new Error("El evento a rechazar no existe")
        }

        if (aEventToReject.status !== EventStatus.PENDING) {
            throw new Error("El evento ya no esta pendiente de aceptacion")
        }

        aEventToReject.status = EventStatus.CANCELED

        const aEventEntity = await this.eventRepository.update(aEventToReject, [])

        let descr = `La organización ${aEventToReject.place.organization.legalName} ha rechazado tu evento en el lugar ${aEventToReject.place.name}.`
        if (reason) {
            descr = `${descr}\nMotivo: ${reason}`
        }

        const notificationBody = {
            title: "Evento rechazado",
            description: descr,
            link: null,
            receiver: aEventToReject.creator
        }

        await this.createNotification.createByUser(notificationBody.title, notificationBody.description, notificationBody.link, notificationBody.receiver)

        return aEventEntity
    }
}
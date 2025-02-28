import { Inject, Injectable } from '@nestjs/common';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { Event } from '../model/event.entity';
import { IEventRepository } from '../port/iEventRepository';
import { IParticipantRepository } from '../port/iParticipantRepository';

@Injectable()
export class ActionEventOrganization implements ActionEventOrganization {

    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository,
        @Inject(IParticipantRepository)
        private readonly participantRepository: IParticipantRepository,
        private readonly createNotification: CreateNotification,
    ) {
    }

    async accept(idEvent: string, idOrganization: string): Promise<Event> {
        const participantRepository = await this.participantRepository.findParticipantsByEvent(idEvent);
        let organization;
        let event;
        let aParticipant
        for (const p of participantRepository) {
            if (p.event.id === idEvent && p.organization.id === idOrganization) {
                organization = p.organization;
                event = await this.eventRepository.findById(p.event.id)
                p.status = "Accepted";
                aParticipant = await this.participantRepository.update(p, event)
            }
        }

        const notificationBody = {
            title: "Evento aceptado",
            description: `La organización ${organization.legalName} ha aceptado tu solicitud y participará en el evento ${event.name}.`,
            link: null,
            receiver: event.creator
        }
        await this.createNotification.createByUser(notificationBody.title, notificationBody.description, notificationBody.link, notificationBody.receiver)
        return aParticipant;
    }
    async reject(idEvent: string, idOrganization: string, reason: string): Promise<Event> {
        const participantRepository = await this.participantRepository.findParticipantsByEvent(idEvent);
        let organization;
        let event;
        let aParticipant
        for (const p of participantRepository) {
            if (p.event.id === idEvent && p.organization.id === idOrganization) {
                organization = p.organization;
                event = await this.eventRepository.findById(p.event.id)
                p.status = "Reject";
                aParticipant = await this.participantRepository.update(p, event)
            }
        }

        let descr = `La organización ${organization.legalName} ha rechazado estar en tu evento ${event.name}.`
        if (reason) {
            descr = `${descr}\nMotivo: ${reason}`
        }

        const notificationBody = {
            title: "Evento rechazado",
            description: descr,
            link: null,
            receiver: event.creator
        }

        await this.createNotification.createByUser(notificationBody.title, notificationBody.description, notificationBody.link, notificationBody.receiver)

        return aParticipant;
    }
}
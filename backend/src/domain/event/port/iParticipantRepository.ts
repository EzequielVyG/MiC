import { EventParticipant as DomainParticipant } from '../../../domain/event/model/event-participant.entity';
import { Event as DomainEvent } from '../../../domain/event/model/event.entity';
import { EventParticipant } from '../model/event-participant.entity';

export interface IParticipantRepository {
    findAll(): Promise<EventParticipant[]>;
    create(participant: DomainParticipant, aEvent: DomainEvent): Promise<EventParticipant>;
    update(participant: DomainParticipant,aEvent: DomainEvent): Promise<EventParticipant>;
    delete(id: string): Promise<string>;
    findParticipantsByEvent (id:string) : Promise<EventParticipant[]>;
    findStatus(idEvent,idOrganization):Promise<string>;
}

export const IParticipantRepository = Symbol('IParticipantRepository');
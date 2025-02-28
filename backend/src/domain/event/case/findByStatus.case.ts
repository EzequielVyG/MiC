import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '../port/iEventRepository';
import { Event } from '../model/event.entity';
import { IFindByStatus } from '../port/iFindByStatus';
import { EventStatus } from '../model/event-status.enum';

@Injectable()
export class FindByStatus implements IFindByStatus {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository,
    ) { }
    findByStatuses(statuses: EventStatus[]): Promise<Event[]> {
        return this.eventRepository.findByStatuses(statuses);
    }


}
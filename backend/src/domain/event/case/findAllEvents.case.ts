import { Injectable, Inject } from '@nestjs/common';
import { IFindAllEvents } from '../port/iFindAllEvents';
import { IEventRepository } from '../port/iEventRepository';
import { Event } from '../model/event.entity';

@Injectable()
export class FindAllEvents implements IFindAllEvents {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }

    async findAll(): Promise<Event[]> {
        return this.eventRepository.findAll();
    }
}

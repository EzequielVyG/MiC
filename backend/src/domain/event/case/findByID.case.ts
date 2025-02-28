import { Injectable, Inject } from '@nestjs/common';
import { IFindEventById } from '../port/iFindById';
import { IEventRepository } from '../port/iEventRepository';
import { Event } from '../model/event.entity';

@Injectable()
export class FindEventById implements IFindEventById {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }

    async findById(id: string): Promise<Event> {
        const aEvent = this.eventRepository.findById(id);

        if (!aEvent) {
            throw new Error("El evento a buscar no existe")
        }

        return aEvent
    }

}

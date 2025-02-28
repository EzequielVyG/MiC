import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../model/event.entity';
import { IEventRepository } from '../port/iEventRepository';
import { IFindFirst15VigentEvents } from '../port/iFindFirst15VigentEvents';

@Injectable()
export class FindFirst15VigentEvents implements IFindFirst15VigentEvents {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }

    async findFirst15VigentEvents(lat: number, lng: number): Promise<Event[]> {
        const aEvent = this.eventRepository.findFirst15VigentEvents(lat,lng);
        if (!aEvent) {
            throw new Error("Los eventos a buscar no existe")
        }

        return aEvent
    }

}

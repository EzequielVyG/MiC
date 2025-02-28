import { Inject, Injectable } from '@nestjs/common';
import { IEventRepository } from '../port/iEventRepository';
import { IFindEventsWithinOneDay } from '../port/iFindEventsWithinOneDay';

@Injectable()
export class FindEventsWithinOneDay implements IFindEventsWithinOneDay {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }

    async findEventsWithinOneDay(): Promise<any[]> {
        try {
            const events = await this.eventRepository.findEventsWithinOneDay();
            if (!events || events.length === 0) {
                throw new Error("No se encontraron eventos para el día actual");
            }

            return events;
        } catch (error) {
            throw new Error(`Error al buscar eventos: ${error.message}`);
        }
    }
}

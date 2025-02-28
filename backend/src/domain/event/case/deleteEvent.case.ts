import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '../port/iEventRepository';
import { Event } from '../model/event.entity';
import { IDeleteEvent } from '../port/iDeleteEvent';

@Injectable()
export class DeleteEvent implements IDeleteEvent {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }

    async delete(id: string): Promise<Event> {
        const aEventToDelete = await this.eventRepository.findById(id);
        if (!aEventToDelete) {
            throw new Error("El evento a eliminar no existe")
        }

        return this.eventRepository.delete(id);
    }
}

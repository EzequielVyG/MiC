import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../model/event.entity';
import { IEventRepository } from '../port/iEventRepository';
import { IFindVigentByPlace } from '../port/iFindVigentByPlace';

@Injectable()
export class FindVigentByPlace implements IFindVigentByPlace {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }

    async findVigentByPlace(id_place: string): Promise<Event[]> {
        const aEvent = this.eventRepository.findVigentByPlace(id_place);
        if (!aEvent) {
            throw new Error("Los eventos a buscar no existe")
        }

        return aEvent
    }

}

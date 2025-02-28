import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '../port/iEventRepository';
import { Event } from '../model/event.entity';
import { IFindEventByCategory } from '../port/iFindByCategory';

@Injectable()
export class FindEventByCategory implements IFindEventByCategory {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }
    findByCategory(categoryId: string): Promise<Event[]> {
        return this.eventRepository.findByCategory(categoryId);

    }

}

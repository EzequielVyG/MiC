import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '../port/iEventRepository';
import { Event } from '../model/event.entity';
import { IFindEventByCategories } from '../port/IFindByCategories';

@Injectable()
export class FindEventByCategories implements IFindEventByCategories {
    constructor(
        @Inject(IEventRepository)
        private readonly eventRepository: IEventRepository
    ) { }
    findByCategories(categoryId: string[]): Promise<Event[]> {
        return this.eventRepository.findByCategories(categoryId);
    }

}

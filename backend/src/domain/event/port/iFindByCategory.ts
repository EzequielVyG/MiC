import { Event } from '../model/event.entity';

export interface IFindEventByCategory {
    findByCategory(categoryId: string): Promise<Event[]>;
}

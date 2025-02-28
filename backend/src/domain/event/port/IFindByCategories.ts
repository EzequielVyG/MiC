import { Event } from '../model/event.entity';

export interface IFindEventByCategories {
    findByCategories(categoryId: string[]): Promise<Event[]>;
}

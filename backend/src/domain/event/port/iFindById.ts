import { Event } from '../model/event.entity';

export interface IFindEventById {
    findById(id: string): Promise<Event>;
}

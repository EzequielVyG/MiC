import { Event } from '../model/event.entity';

export interface IFindAllEvents {
    findAll(): Promise<Event[]>;
}

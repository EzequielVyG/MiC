import { Event } from '../model/event.entity';

export interface IDeleteEvent {
    delete(id: string): Promise<Event>;
}

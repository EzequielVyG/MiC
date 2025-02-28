import { Event } from '../model/event.entity';

export interface IFindFirst15VigentEvents {
    findFirst15VigentEvents(lat: number, lng: number): Promise<Event[]>;
}

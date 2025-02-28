import { Event } from '../model/event.entity';

export interface IFindVigentByPlace {
    findVigentByPlace(id_place: string): Promise<Event[]>;
}

import { Event } from '../model/event.entity';

export interface IFindEventByUser {
    findByUser(mail: string): Promise<Event[]>;
    findByUserAndVigente(mail: string): Promise<Event[]>;
    findByFilters(statuses: string[] | null, organizations: string[] | null): Promise<Event[]>
}

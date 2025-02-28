import { Event } from '../model/event.entity';

export interface IFindByStatus {
    findByStatuses(statuses: string[] | null): Promise<Event[]>
}

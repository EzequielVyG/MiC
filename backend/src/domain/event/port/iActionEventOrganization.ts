import { Event } from '../model/event.entity';

export interface IActionEventOrganization {
    accept(id: string): Promise<Event>;
    reject(id: string, reason: string): Promise<Event>;
}
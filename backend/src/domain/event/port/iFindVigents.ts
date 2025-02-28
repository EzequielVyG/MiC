import { Event } from '../model/event.entity';

export interface IFindVigents {
	findAll(): Promise<Event[]>;
}

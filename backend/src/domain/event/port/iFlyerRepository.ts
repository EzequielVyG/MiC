import { EventFlyer } from '../model/event-flyer.entity';
import { Event } from '../model/event.entity';

export interface IFlyerRepository {
    create(aFlyer: EventFlyer, aEvent: Event): Promise<EventFlyer>;
}

export const IFlyerRepository = Symbol('IFlyerRepository');

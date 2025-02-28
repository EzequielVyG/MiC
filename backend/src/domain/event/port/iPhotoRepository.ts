import { EventPhoto } from '../model/event-photo.entity';
import { Event } from '../model/event.entity';

export interface IPhotoRepository {
    create(aPhoto: EventPhoto, aEvent: Event): Promise<EventPhoto>;
}

export const IPhotoRepository = Symbol('IPhotoRepository');

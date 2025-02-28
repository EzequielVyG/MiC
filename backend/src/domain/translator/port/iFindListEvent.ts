import { Event } from 'src/domain/event/model/event.entity';
import { Translator } from '../model/translator';

export interface IfindListEvent {
    findListEvent(listEvent: Event[]): Promise<Translator[]>;
}

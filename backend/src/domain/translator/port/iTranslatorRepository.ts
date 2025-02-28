import { Event } from 'src/domain/event/model/event.entity';
import { Place } from 'src/domain/place/model/place.entity';
import { Translator } from '../model/translator';

export interface ITranslatorRepository {
    findAll(): Promise<Translator[]>;
    findByIdentificator(identificadorId: string, entity: string): Promise<Translator[]>;
    findListPlace(listPlace:Place[]): Promise<Translator[]>;
    findListEvent(listEvent:Event[]): Promise<Translator[]>;
    save(aTranslator: Translator): Promise<Translator>;
    update(aTranslator: Translator): Promise<Translator>;
}

export const ITranslatorRepository = Symbol('ITranslatorRepository');

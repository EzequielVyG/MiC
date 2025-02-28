import { Place } from 'src/domain/place/model/place.entity';
import { Translator } from '../model/translator';

export interface IfindListPlace {
    findListPlace(listPlace: Place[]): Promise<Translator[]>;
}

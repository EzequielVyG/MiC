import { Translator } from '../model/translator';

export interface IfindByIdentificator {
    findByIdentificator(identificadorId: string, entity: string): Promise<Translator[]>;
}

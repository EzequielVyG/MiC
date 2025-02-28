import { Translator } from '../model/translator';


export interface IfindAllTranslator {
    findAll(): Promise<Translator[]>;
}

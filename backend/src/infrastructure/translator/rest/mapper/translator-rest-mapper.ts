import { Translator } from 'src/domain/translator/model/translator';
import { TranslatorPayload } from '../payload/translator-payload';

export class TranslatorRestMapper {
    static toPayload(translator: Translator): TranslatorPayload {
        return {
            id: translator.id,
            entity: translator.entity,
            identificador: translator.identificador,
            campo: translator.campo,
            idioma: translator.idioma,
            traduccion: translator.traduccion,
        }
    }
}
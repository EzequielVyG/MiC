import { Translator as TypeORMTranslator } from '../model/translator.entity';
import { Translator as DomainTranslator } from 'src/domain/translator/model/translator';

export class TranslatorMapper {
    static toDomain(translator: TypeORMTranslator): DomainTranslator {
        const domainTranslator: DomainTranslator = new DomainTranslator();
        domainTranslator.id = translator.id;
        domainTranslator.entity = translator.entity;
        domainTranslator.identificador = translator.identificador;
        domainTranslator.campo = translator.campo;
        domainTranslator.idioma = translator.idioma;
        domainTranslator.traduccion = translator.traduccion;

        return domainTranslator;
    }

    static toTypeORM(domainCategory: DomainTranslator): TypeORMTranslator {
        const typeORMTranslator = new TypeORMTranslator();
        typeORMTranslator.id = domainCategory.id;
        typeORMTranslator.entity = domainCategory.entity;
        typeORMTranslator.identificador = domainCategory.identificador;
        typeORMTranslator.campo = domainCategory.campo;
        typeORMTranslator.idioma = domainCategory.idioma;
        typeORMTranslator.traduccion = domainCategory.traduccion;

        return typeORMTranslator;
    }
}

import { Faq as TypeORMFaq } from '../model/faq.entity';
import { Faq as DomainFaq } from '../../../../domain/faq/model/faq.entity';  // Asegúrate de importar la ubicación correcta

export class FaqMapper {
    static toDomain(faq: TypeORMFaq): DomainFaq {
        const domainFaq: DomainFaq = new DomainFaq()
        domainFaq.id = faq.id
        domainFaq.question = faq.question
        domainFaq.answer = faq.answer
        domainFaq.button_route = faq.button_route

        return domainFaq;
    }

    static toTypeORM(domainFaq: DomainFaq): TypeORMFaq {
        const typeORMFaq = new TypeORMFaq();
        typeORMFaq.id = domainFaq.id;
        typeORMFaq.question = domainFaq.question;
        typeORMFaq.answer = domainFaq.answer;
        typeORMFaq.button_route = domainFaq.button_route;

        return typeORMFaq;
    }
}
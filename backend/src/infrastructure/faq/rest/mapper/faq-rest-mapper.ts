import { Faq } from 'src/domain/faq/model/faq.entity';
import { FaqPayload } from '../payload/faq-payload';

export class FaqRestMapper {
	static toPayload(faq: Faq): FaqPayload {
		return {
			id: faq.id,
			question: faq.question,
			answer: faq.answer,
			button_route: faq.button_route
		}
	}
}
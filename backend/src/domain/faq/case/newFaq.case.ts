import { Injectable, Inject } from '@nestjs/common';

require('dotenv').config();

import { IFaqRepository } from '../port/iFaqRepository';
import { Faq } from '../model/faq.entity';
import { INewFaq } from '../port/iNewFaq';

@Injectable()
export class NewFaq implements INewFaq {
	constructor(
		@Inject(IFaqRepository)
		private faqRepository: IFaqRepository
	) { }

	async save(question: string, answer: string): Promise<Faq> {
        const aFaq = new Faq();
        aFaq.question = question;
        aFaq.answer = answer;
        return this.faqRepository.save(aFaq);
	}
}

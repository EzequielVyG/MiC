import { Injectable, Inject } from '@nestjs/common';
import { IFindAllFaq } from '../port/iFindAllFaq';
import { IFaqRepository } from '../port/iFaqRepository';
import { Faq } from '../model/faq.entity';

@Injectable()
export class FindAllFaq implements IFindAllFaq {
	constructor(
		@Inject(IFaqRepository)
		private readonly faqRepository: IFaqRepository
	) { }

	async findAll(): Promise<Faq[]> {
		return this.faqRepository.findAll();
	}
}

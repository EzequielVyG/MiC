import { Faq } from '../model/faq.entity';

export interface INewFaq {
	save(question: string, answer: string): Promise<Faq>;
}

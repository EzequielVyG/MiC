import { Faq } from '../model/faq.entity';

export interface IFaqRepository {
	findAll(): Promise<Faq[]>;
	save(aFaq: Faq): Promise<Faq>;
}

export const IFaqRepository = Symbol('IFaqRepository');

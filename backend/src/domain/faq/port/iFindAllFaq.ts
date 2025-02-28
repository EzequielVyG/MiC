import { Faq } from '../model/faq.entity';

export interface IFindAllFaq {
	findAll(): Promise<Faq[]>;
}

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Faq as TypeORMFaq } from 'src/infrastructure/faq/typeorm/model/faq.entity';
import { Faq as DomainFaq } from 'src/domain/faq/model/faq.entity';
import { IFaqRepository } from 'src/domain/faq/port/iFaqRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqMapper } from '../mapper/faq.typeorm.mapper';

@Injectable()
export class FaqRepository implements IFaqRepository {
	constructor(
		@InjectRepository(TypeORMFaq)
		private readonly faqRepository: Repository<TypeORMFaq>
	) { }

	async findAll(): Promise<DomainFaq[]> {
		const faqs = await this.faqRepository.find();
		return faqs.map(faq => FaqMapper.toDomain(faq));
	}

	async save(aFaq: DomainFaq): Promise<DomainFaq> {
		const typeORMFaq = FaqMapper.toTypeORM(aFaq);
		const savedFaq = await this.faqRepository.save(typeORMFaq);

		return FaqMapper.toDomain(savedFaq);
	}
}

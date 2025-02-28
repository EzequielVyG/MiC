import { Controller, Get, Post, Body } from '@nestjs/common';
import { Faq } from '../../../../domain/faq/model/faq.entity';
import { FaqRestMapper } from '../mapper/faq-rest-mapper';
import { responseJson } from 'src/util/responseMessage';
import { FaqPayload } from '../payload/faq-payload';
import { FindAllFaq } from 'src/domain/faq/case/findAllFaq.case';
import { FaqInput } from '../input/faq-input';
import { NewFaq } from 'src/domain/faq/case/newFaq.case';

@Controller('faq')
export class FaqController {
	constructor(
		private readonly findAllFaq: FindAllFaq,
		private readonly newFaq: NewFaq
	) { }

	@Get()
	async findAll(): Promise<FaqPayload[]> {
		try {
			const someFaq: Faq[] = await this.findAllFaq.findAll();
			return responseJson(
				200,
				'Faqs recuperados con exito',
				someFaq.map((aFaq) => {
					return FaqRestMapper.toPayload(aFaq);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	async create(@Body() faq: FaqInput): Promise<FaqPayload> {
		try {
			const aFaq: Faq = await this.newFaq.save(
				faq.question,
				faq.answer
			);
			return responseJson(
				200,
				'Faq ingresado con exito',
				FaqRestMapper.toPayload(aFaq)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}

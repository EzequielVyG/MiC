import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../model/category.entity';
import { ICategoryRepository } from '../port/iCategoryRepository';
import { IFindAllNotEvent } from '../port/iFindAllNotEvent';

@Injectable()
export class FindAllNotEvent implements IFindAllNotEvent {
	constructor(
		@Inject(ICategoryRepository)
		private readonly categoriaRepository: ICategoryRepository
	) { }
	async findAll(): Promise<Category[]> {
		const categorySearch = await this.categoriaRepository.findAllNotEvent();
		return categorySearch
	}
}

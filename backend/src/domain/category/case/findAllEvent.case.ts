import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../model/category.entity';
import { ICategoryRepository } from '../port/iCategoryRepository';
import { IFindAllEvent } from '../port/iFindAllEvent';

@Injectable()
export class FindAllEvent implements IFindAllEvent {
	constructor(
		@Inject(ICategoryRepository)
		private readonly categoriaRepository: ICategoryRepository
	) { }
	async findAll(): Promise<Category[]> {
		const categorySearch = await this.categoriaRepository.findAllEvent();
		return categorySearch
	}
}

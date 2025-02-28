import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../model/category.entity';
import { ICategoryRepository } from '../port/iCategoryRepository';
import { IfindAllCategory } from '../port/iFindAllCategory';

@Injectable()
export class FindAllCategoryWithVigentEvents implements IfindAllCategory {
	constructor(
		@Inject(ICategoryRepository)
		private readonly categoriaRepository: ICategoryRepository
	) {}

	async findAll(): Promise<Category[]> {
		return this.categoriaRepository.findAllWithVigentEvents();
	}
}

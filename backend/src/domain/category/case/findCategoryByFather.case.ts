import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../model/category.entity';
import { ICategoryRepository } from '../port/iCategoryRepository';
import { IfindCategoryByFather } from '../port/iFindCategoryByFather';

@Injectable()
export class FindCategoryByFather implements IfindCategoryByFather {
	constructor(
		@Inject(ICategoryRepository)
		private readonly categoriaRepository: ICategoryRepository
	) { }
	async findByFather(father: Category | null): Promise<Category[]> {
		const categorySearch = await this.categoriaRepository.findByFather(father);
		return categorySearch
	}
}

import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../model/category.entity';
import { ICategoryRepository } from '../port/iCategoryRepository';
import { IFindPrincipalCategories } from '../port/iFindPrincipalCategories';

@Injectable()
export class FindPrincipalCategories implements IFindPrincipalCategories {
	constructor(
		@Inject(ICategoryRepository)
		private readonly categoriaRepository: ICategoryRepository
	) { }

	async findAllPlaces(): Promise<Category[]> {
		const categorySearch = await this.categoriaRepository.findByFatherAndGroups(null, ["Negocios y Servicios", "Lugares de interés"]);
		return categorySearch
	}
	async findAllEvents(): Promise<Category[]> {
		const categorySearch = await this.categoriaRepository.findByFatherAndGroups(null, ["Eventos",]);
		return categorySearch
	}
	async findAll(): Promise<Category[]> {
		const categorySearch = await this.categoriaRepository.findByFatherAndGroups(null, ["Negocios y Servicios", "Eventos", "Lugares de interés"]);
		return categorySearch
	}
}

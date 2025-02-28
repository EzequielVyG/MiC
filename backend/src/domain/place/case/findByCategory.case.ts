import { Injectable, Inject } from '@nestjs/common';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { Place } from '../model/place.entity';
import { IFindByCategory } from '../port/iFindByCategory';
import { ICategoryRepository } from 'src/domain/category/port/iCategoryRepository';

@Injectable()
export class FindByCategory implements IFindByCategory {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository,
		@Inject(ICategoryRepository)
		private readonly categoryRepository: ICategoryRepository
	) {}

	async findAll(id: string, lat: number, lng: number): Promise<Place[]> {
		const aCategory = await this.categoryRepository.findByID(id);
		return this.placeRepository.findByCategory(aCategory, lat, lng);
	}
}

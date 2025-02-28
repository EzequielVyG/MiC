import { Injectable, Inject } from '@nestjs/common';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { Place } from '../model/place.entity';
import { ICategoryRepository } from 'src/domain/category/port/iCategoryRepository';
import { IFindByCategories } from '../port/iFindByCategories';

@Injectable()
export class FindByCategories implements IFindByCategories {
    constructor(
        @Inject(IPlaceRepository)
        private readonly placeRepository: IPlaceRepository,
        @Inject(ICategoryRepository)
        private readonly categoryRepository: ICategoryRepository
    ) { }

    async findAll(ids: string[], lat: number, lng: number): Promise<Place[]> {
        const aCategory = await this.categoryRepository.findAllByIds(ids);
        return this.placeRepository.findByCategories(aCategory, lat, lng);
    }
}

import { Injectable, Inject } from '@nestjs/common';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { Place } from '../model/place.entity';
import { Location } from '../model/place-location';
import { IFindByDistance } from '../port/iFindByDistance';

@Injectable()
export class FindByDistance implements IFindByDistance {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository
	) {}

	async findAll(punto: Location): Promise<Place[]> {
		return this.placeRepository.findByDistance(punto);
	}
}

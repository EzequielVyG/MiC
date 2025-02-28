import { Injectable, Inject } from '@nestjs/common';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { Place } from '../model/place.entity';
import { IDeletePlace } from '../port/iDeletePlace';

@Injectable()
export class DeletePlace implements IDeletePlace {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository
	) {}

	async delete(id: string): Promise<Place> {
		return this.placeRepository.delete(id);
	}
}

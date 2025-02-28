import { Inject, Injectable } from '@nestjs/common';
import { Place } from '../model/place.entity';
import { IFindPlaces } from '../port/iFindPlaces';
import { IPlaceRepository } from '../port/iPlaceRepository';

@Injectable()
export class FindPlaces implements IFindPlaces {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository
	) { }

	async findAll(): Promise<Place[]> {
		return this.placeRepository.findAll();
	}

	async findAllByDistance(lat: number, lng: number): Promise<Place[]> {
		return this.placeRepository.findAllByDistance(lat,lng);
	}

	async findAllWithEvents(): Promise<Place[]> {
		return this.placeRepository.findAllWithEvents();
	}

	async findByName(name: string): Promise<Place> {
		return this.placeRepository.findByName(name);
	}

	async findById(id: string): Promise<Place> {
		return this.placeRepository.findById(id);
	}
}

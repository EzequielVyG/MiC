import { Place } from '../model/place.entity';

export interface IFindPlaces {
	findAll(): Promise<Place[]>;
	findAllByDistance(lat: number, lng: number): Promise<Place[]>;
	findByName(name: string): Promise<Place>;
	findById(id: string): Promise<Place>;
	findAllWithEvents(): Promise<Place[]>;
}

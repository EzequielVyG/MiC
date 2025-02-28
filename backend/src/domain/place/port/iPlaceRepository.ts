import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Location } from '../model/place-location';
import { Place } from '../model/place.entity';

export interface IPlaceRepository {
	findAll(): Promise<Place[]>;
	findAllByDistance(lat: number, lng: number): Promise<Place[]>;
	findAllWithEvents(): Promise<Place[]>;
	findById(id: string): Promise<Place>;
	findByName(name: string): Promise<Place>;
	create(place: Place, files: MulterFile[]): Promise<Place>;
	delete(name: string): Promise<Place>;
	update(place: Place, files: MulterFile[]): Promise<Place>;
	findByDistance(punto: Location): Promise<Place[]>;
	findByCategory(
		category: Category,
		lat: number,
		lng: number
	): Promise<Place[]>;
	findByCategories(
		category: Category[],
		lat: number,
		lng: number
	): Promise<Place[]>;
	findByOrganization(organization: Organization): Promise<Place[]>;
}

export const IPlaceRepository = Symbol('IPlaceRepository');

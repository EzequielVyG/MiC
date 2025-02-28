import { MulterFile } from 'multer';
import { Category } from "src/domain/category/model/category.entity";
import { Organization } from "src/domain/organization/model/organization.entity";
import { Location } from '../model/place-location';
import { Place } from "../model/place.entity";
import { IPlaceRepository } from "../port/iPlaceRepository";

export class MockPlaceRepository implements IPlaceRepository {
    private places: Place[]; // Lista de lugares

    constructor(initialPlaces: Place[] = []) {
        this.places = initialPlaces;
    }

    create(place: Place, files: MulterFile[]): Promise<Place> {
        console.log(place)
        console.log(files)
        throw new Error('Method not implemented.');
    }
    delete(name: string): Promise<Place> {
        console.log(name)
        throw new Error('Method not implemented.');
    }
    update(place: Place, files: MulterFile[]): Promise<Place> {
        console.log(place)
        console.log(files)
        throw new Error('Method not implemented.');
    }
    findByDistance(punto: Location): Promise<Place[]> {
        console.log(punto)
        throw new Error('Method not implemented.');
    }
    findByCategory(category: Category, lat: number, lng: number): Promise<Place[]> {
        console.log(category)
        console.log(lat)
        console.log(lng)
        throw new Error('Method not implemented.');
    }
    findByCategories(category: Category[], lat: number, lng: number): Promise<Place[]> {
        console.log(category)
        console.log(lat)
        console.log(lng)
        throw new Error('Method not implemented.');
    }
    findByOrganization(organization: Organization): Promise<Place[]> {
        console.log(organization)
        throw new Error('Method not implemented.');
    }

    findAllByDistance(lat: number, lng: number): Promise<Place[]> {
        console.log(lat)
        console.log(lng)
        throw new Error('Method not implemented.');
    }

    async findAll(): Promise<Place[]> {
        // Devuelve todos los lugares
        return Promise.resolve(this.places);
    }

    async findAllWithEvents(): Promise<Place[]> {
        // Implementa lógica para devolver datos de prueba
        return [];
    }

    async findByName(name: string): Promise<Place> {
        const place = this.places.find(place => place.name === name);
        return place || null;
    }

    async findById(id: string): Promise<Place> {
        const place = this.places.find(place => place.id === id);
        return place || null;
    }
}
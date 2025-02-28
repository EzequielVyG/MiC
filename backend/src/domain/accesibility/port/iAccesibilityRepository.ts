import { Accesibility } from "../model/accesibility.entity";

export interface IAccesibilityRepository {
	findAll(): Promise<Accesibility[]>;
}

export const IAccesibilityRepository = Symbol('IAccesibilityRepository');

import { Category } from "src/domain/category/model/category.entity";
import { Circuit } from "../model/circuit.entity";

export interface ICircuitRepository {
	findAll(): Promise<Circuit[]>;
	findById(id: string): Promise<Circuit>;
	findByName(name: string): Promise<Circuit>;
	findByCategory(category: Category): Promise<Circuit[]>;
	create(circuit: Circuit): Promise<Circuit>;
	delete(name: string): Promise<Circuit>;
	update(circuit: Circuit): Promise<Circuit>;
}

export const ICircuitRepository = Symbol('ICircuitRepository');

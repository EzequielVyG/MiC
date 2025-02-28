import { Circuit } from "../model/circuit.entity";

export interface IFindCircuits {
	findAll(): Promise<Circuit[]>;
	findByName(name: string): Promise<Circuit>;
	findById(id: string): Promise<Circuit>;
}

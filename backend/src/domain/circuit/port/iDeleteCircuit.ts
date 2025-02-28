import { Circuit } from "../model/circuit.entity";

export interface IDeleteCircuit {
	delete(name: string): Promise<Circuit>;
}

import { Circuit } from "../model/circuit.entity";

export function validateCircuit(aCircuit: Circuit): void {
	if (aCircuit.principalCategory.father) {
		throw new Error('La categoría principal debe ser una categoría padre');
	}
}

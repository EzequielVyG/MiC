import { Circuit } from '../model/circuit.entity';

export function validateCircuit(aCircuit: Circuit): void {
	if (!aCircuit.name || aCircuit.name === '') {
		throw new Error('El nombre es requerido');
	}

	if (!aCircuit.principalCategory) {
		throw new Error('La categoría principal es requerida');
	}

	if (aCircuit.places.length <= 1) {
		throw new Error('El circuito debe tener al menos dos lugares');
	}
}

import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function esURL(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
}

// function isValidMinors(value: string): boolean {
// 	return Object.values(Minors).includes(value as Minors);
// }

function isValidSchedule(schedule: PlaceSchedule): boolean {
	const openingTime = new Date(`1970-01-01T${schedule.openingHour}`);
	const closingTime = new Date(`1970-01-01T${schedule.closingHour}`);

	if (closingTime <= openingTime) {
		return false;
	}

	return true;
}

function haySuperposicion(horarios: PlaceSchedule[]): boolean {
	for (let i = 0; i < horarios.length; i++) {
		const horarioA = horarios[i];
		for (let j = i + 1; j < horarios.length; j++) {
			const horarioB = horarios[j];
			if (horarioA.dayOfWeek.name === horarioB.dayOfWeek.name) {
				if (
					(horarioA.openingHour >= horarioB.openingHour &&
						horarioA.openingHour < horarioB.closingHour) ||
					(horarioA.closingHour > horarioB.openingHour &&
						horarioA.closingHour <= horarioB.closingHour) ||
					(horarioB.openingHour >= horarioA.openingHour &&
						horarioB.openingHour < horarioA.closingHour) ||
					(horarioB.closingHour > horarioA.openingHour &&
						horarioB.closingHour <= horarioA.closingHour)
				) {
					return true;
				}
			}
		}
	}
	return false;
}

export function validatePlace(aPlace: Place): void {
	if (!aPlace.name) {
		throw new Error('El nombre es requerido');
	}
	if (!aPlace.principalCategory) {
		throw new Error('La categoría principal es requerida');
	}

	if (aPlace.principalCategory.father) {
		throw new Error('La categoría principal debe ser una categoría padre');
	}

	if (haySuperposicion(aPlace.schedules)) {
		throw new Error('Hay superposición entre los horarios');
	}

	if (!aPlace.location) {
		throw new Error('La ubicación es requerida');
	}

	if (aPlace.location.lat > 90 || aPlace.location.lat < -90) {
		throw new Error('Latitud fuera de los limites permitidos');
	}

	if (aPlace.location.lng > 180 || aPlace.location.lng < -180) {
		throw new Error('Longitud fuera de los limites permitidos');
	}

	// if (!esURL(aPlace.url)) {
	//     throw new Error("URL invalida")
	// }

	// if (aPlace.minors && !isValidMinors(aPlace.minors)) {
	// 	throw new Error('Calificacion de menores invalida');
	// }

	if (aPlace.schedules) {
		for (const schedule of aPlace.schedules) {
			if (!isValidSchedule(schedule)) {
				throw new Error('Horario de cierre anterior al horario de apertura');
			}
		}
	}
}

import { EventStatus } from '../model/event-status.enum';

export function getEventStatus(
	startDate: Date | null,
	endDate: Date | null,
	isDraft: boolean,
	mio: boolean
): EventStatus {
	if (isDraft) {
		return EventStatus.DRAFT;
	} else if (!mio) {
		return EventStatus.PENDING;
	}
	if (!startDate) {
		return EventStatus.DRAFT;
	}

	let fechaFin;
	if (endDate) {
		fechaFin = new Date(
			endDate.getFullYear(),
			endDate.getMonth(),
			endDate.getDate(),
			endDate.getHours(),
			endDate.getMinutes() + endDate.getTimezoneOffset(),
			endDate.getSeconds()
		);
	}

	const fechaInicio = new Date(
		startDate.getFullYear(),
		startDate.getMonth(),
		startDate.getDate(),
		startDate.getHours(),
		startDate.getMinutes() + startDate.getTimezoneOffset(),
		startDate.getSeconds()
	);

	const fechaActual = new Date();

	if (
		fechaInicio > fechaActual ||
		!endDate ||
		fechaActual < fechaFin ||
		fechaActual > fechaFin
	) {
		return EventStatus.SCHEDULED;
	} else {
		return EventStatus.PENDING;
	}
}

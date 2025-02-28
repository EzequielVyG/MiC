import { DayOfWeek } from './day-of-week.entity';

export class PlaceSchedule {
	id: string;
	dayOfWeek: DayOfWeek;
	openingHour: string;
	closingHour: string;
}

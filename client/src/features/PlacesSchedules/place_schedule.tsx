import { DayOfWeek } from "../DayOfWeek/day_of_week";
import { Place } from "../Places/place";

export interface PlaceSchedule {
    id?: string;
    place: Place;
    dayOfWeek?: DayOfWeek;
    openingHour:string;
    closingHour:string;
}

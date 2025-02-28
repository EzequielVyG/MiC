import { Place } from "../Places/place";

export interface PlacePhoto {
    id?: string;
    place: Place;
    photoUrl: string;
}
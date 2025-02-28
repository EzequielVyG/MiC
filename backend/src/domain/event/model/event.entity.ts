import { Category } from "src/domain/category/model/category.entity";
import { Place } from "src/domain/place/model/place.entity";
import { User } from "src/domain/user/model/user.entity";
import { EventParticipant } from "./event-participant.entity";
import { EventPhoto } from "./event-photo.entity";
import { EventFlyer } from "./event-flyer.entity";

export class Event {
    id: string;
    name: string;
    description: string;
    minors: string;
    place?: Place
    creator: User
    startDate: Date
    endDate: Date
    price: string
    photos: EventPhoto[];
    flyers: EventFlyer[];
    url: string
    urlTicketera: string
    status: string
    origin: string
    principalCategory: Category;
    categories: Category[];
    participants: EventParticipant[];
}
//TODO: le falta categoria al evento, se deja para la tarea de refactor de categorias

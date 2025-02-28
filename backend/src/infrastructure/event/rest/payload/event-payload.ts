import { EventParticipant } from "src/domain/event/model/event-participant.entity";
import { EventPhoto } from "src/domain/event/model/event-photo.entity";
import { EventFlyer } from "src/domain/event/model/event-flyer.entity";
import { CategoryPayload } from "src/infrastructure/category/rest/payload/category-payload";
import { PlacePayload } from "src/infrastructure/place/rest/payload/place-payload";
import { UserPayload } from "src/infrastructure/user/rest/payload/user-payload";


export class EventPayload {
    id: string;
    name: string;
    description: string;
    minors: string;
    place: PlacePayload
    principalCategory: CategoryPayload
    categories: CategoryPayload[]
    creator: UserPayload
    startDate: Date
    endDate: Date
    price: string
    photos: EventPhoto[]
    flyers: EventFlyer[]
    url: string
    status: string
    participants: EventParticipant[];
    urlTicketera: string;
}
import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { Place } from 'src/domain/place/model/place.entity';
import { EventParticipant } from '../model/event-participant.entity';
import { EventPhoto } from '../model/event-photo.entity';
import { EventFlyer } from '../model/event-flyer.entity';
import { Event } from '../model/event.entity';

export interface IUpdateEvent {
    update(
        id: string,
        name: string,
        description: string,
        minors: string,
        place: Place,
        principalCategory: Category,
        categories: Category[],
        startDate: string,
        endDate: string,
        price: string,
        photos: EventPhoto[],
        flyers: EventFlyer[],
        url: string,
        files: MulterFile[],
        isDraft: boolean,
        participants: EventParticipant[],
        urlTicketera: string
    ): Promise<Event>;

    cancel(id: string): Promise<Event>;
}

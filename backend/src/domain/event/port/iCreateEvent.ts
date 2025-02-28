import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { Place } from 'src/domain/place/model/place.entity';
import { User } from 'src/domain/user/model/user.entity';
import { EventParticipant } from '../model/event-participant.entity';
import { Event } from '../model/event.entity';

export interface ICreateEvent {
    create(
        name: string,
        description: string,
        minors: string,
        place: Place,
        principalCategory: Category,
        categories: Category[],
        creator: User,
        startDate: string,
        endDate: string,
        price: string,
        url: string,
        origin: string,
        files: MulterFile[],
        isDraft: boolean,
        participants: EventParticipant[],
        urlTicketera: string
    ): Promise<Event>;
}

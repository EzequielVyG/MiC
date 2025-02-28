import { EventPhoto as TypeORMEventPhoto } from '../model/event-photo.entity';
import { EventPhoto as DomainEventPhoto } from 'src/domain/event/model/event-photo.entity';
import { EventMapper } from './event-typeorm.mapper';
import { Event as DomainEvent } from 'src/domain/event/model/event.entity';

export class EventPhotoMapper {
    static toDomain(photo: TypeORMEventPhoto): DomainEventPhoto {
        return {
            id: photo.id,
            photoUrl: photo.photoUrl,
        };
    }

    static toTypeORM(
        photo: DomainEventPhoto,
        aEvent: DomainEvent
    ): TypeORMEventPhoto {
        const typeORMPhoto = new TypeORMEventPhoto();
        typeORMPhoto.id = photo.id;
        typeORMPhoto.photoUrl = photo.photoUrl;
        typeORMPhoto.event = EventMapper.toTypeORM(aEvent);
        return typeORMPhoto;
    }
}

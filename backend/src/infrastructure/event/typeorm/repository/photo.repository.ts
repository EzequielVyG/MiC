import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventPhoto as DomainEventPhoto } from 'src/domain/event/model/event-photo.entity';
import { Event as DomainEvent } from 'src/domain/event/model/event.entity';
import { IPhotoRepository } from 'src/domain/event/port/iPhotoRepository';
import { Repository } from 'typeorm';
import { EventPhotoMapper } from '../mapper/event-photo-typeorm.mapper';
import { EventPhoto as TypeORMEventPhoto } from '../model/event-photo.entity';

@Injectable()
export class PhotoRepository implements IPhotoRepository {
    constructor(
        @InjectRepository(TypeORMEventPhoto)
        private readonly photoRepository: Repository<TypeORMEventPhoto>
    ) { }

    async create(
        aPhoto: DomainEventPhoto,
        aEvent: DomainEvent
    ): Promise<DomainEventPhoto> {
        const typeORMPhoto = EventPhotoMapper.toTypeORM(aPhoto, aEvent);
        const savedPhoto = await this.photoRepository.save(typeORMPhoto);
        return EventPhotoMapper.toDomain(savedPhoto);
    }
}

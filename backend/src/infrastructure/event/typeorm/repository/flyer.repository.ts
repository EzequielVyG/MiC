import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventFlyer as DomainEventFlyer } from 'src/domain/event/model/event-flyer.entity';
import { Event as DomainEvent } from 'src/domain/event/model/event.entity';
import { IFlyerRepository } from 'src/domain/event/port/iFlyerRepository';
import { Repository } from 'typeorm';
import { EventFlyerMapper } from '../mapper/event-flyer-typeorm.mapper';
import { EventFlyer as TypeORMEventFlyer } from '../model/event-flyer.entity';

@Injectable()
export class FlyerRepository implements IFlyerRepository {
    constructor(
        @InjectRepository(TypeORMEventFlyer)
        private readonly flyerRepository: Repository<TypeORMEventFlyer>
    ) { }

    async create(
        aFlyer: DomainEventFlyer,
        aEvent: DomainEvent
    ): Promise<DomainEventFlyer> {
        const typeORMFlyer = EventFlyerMapper.toTypeORM(aFlyer, aEvent);
        const savedFlyer = await this.flyerRepository.save(typeORMFlyer);
        return EventFlyerMapper.toDomain(savedFlyer);
    }
}

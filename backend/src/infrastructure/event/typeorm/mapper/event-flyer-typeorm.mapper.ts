import { EventFlyer as TypeORMEventFlyer} from '../model/event-flyer.entity';
import { EventFlyer as DomainEventFlyer } from 'src/domain/event/model/event-flyer.entity';
import { EventMapper } from './event-typeorm.mapper';
import { Event as DomainEvent } from 'src/domain/event/model/event.entity';

export class EventFlyerMapper {
    static toDomain(flyer: TypeORMEventFlyer): DomainEventFlyer {
        return {
            id: flyer.id,
            flyerUrl: flyer.flyerUrl,
        };
    }

    static toTypeORM(
        flyer: DomainEventFlyer,
        aEvent: DomainEvent
    ): TypeORMEventFlyer {
        const typeORMFlyer = new TypeORMEventFlyer();
        typeORMFlyer.id = flyer.id;
        typeORMFlyer.flyerUrl = flyer.flyerUrl;
        typeORMFlyer.event = EventMapper.toTypeORM(aEvent);
        return typeORMFlyer;
    }
}

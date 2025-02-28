import { EventParticipant as DomainEventParticipant } from 'src/domain/event/model/event-participant.entity';
import { Event as DomainEvent } from 'src/domain/event/model/event.entity';
import { OrganizationMapper } from 'src/infrastructure/organization/typeorm/mapper/organization-typeorm.mapper';
import { EventParticipant as TypeORMEventParticipant } from '../model/event-participant.entity';
import { EventMapper } from './event-typeorm.mapper';

export class EventParticipantMapper {
    static toDomain(participant: TypeORMEventParticipant): DomainEventParticipant {
        return {
            id: participant.id,
            event: participant.event ? EventMapper.toDomain(participant.event) : null,
            organization: participant.organization ? OrganizationMapper.toDomain(participant.organization) : null,
            role: participant.role,
            status: participant.status,
        };
    }

    static toTypeORM(
        participant: DomainEventParticipant,
        aEvent: DomainEvent
    ): TypeORMEventParticipant {
        const typeORMParticipant = new TypeORMEventParticipant();
        typeORMParticipant.id = participant.id;
        typeORMParticipant.organization = participant.organization ? OrganizationMapper.toTypeORM(participant.organization) : null;
        typeORMParticipant.event = EventMapper.toTypeORM(aEvent);
        typeORMParticipant.role = participant.role;
        typeORMParticipant.status = participant.status;
        return typeORMParticipant;
    }
}
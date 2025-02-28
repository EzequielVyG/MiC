import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EventParticipant as DomainParticipant } from 'src/domain/event/model/event-participant.entity';
import { Event as DomainEvent } from 'src/domain/event/model/event.entity';
import { IParticipantRepository } from 'src/domain/event/port/iParticipantRepository';
import { EventParticipant as TypeORMParticipant } from 'src/infrastructure/event/typeorm/model/event-participant.entity';
import { Event as TypeORMEvent } from 'src/infrastructure/event/typeorm/model/event.entity';
import { EntityManager, Repository } from 'typeorm';
import { EventParticipantMapper } from '../mapper/event-participant-typeorm.mapper';

@Injectable()
export class ParticipantRepository implements IParticipantRepository {
    constructor(
        @InjectRepository(TypeORMEvent)
        private readonly eventRepository: Repository<TypeORMEvent>,
        @InjectRepository(TypeORMParticipant)
        private readonly participantRepository: Repository<TypeORMParticipant>,
        @InjectEntityManager()
        private readonly manager: EntityManager
    ) { }

    async findAll(): Promise<DomainParticipant[]> {
        const participants: TypeORMParticipant[] = await this.participantRepository.find({
            relations: [
                'organization',
            ],
        });
        return participants.map((participant) => EventParticipantMapper.toDomain(participant));
    }

    async findStatus(idEvent: string, idOrganization: string): Promise<string> {
        const participant = await this.participantRepository
            .createQueryBuilder('participant')
            .innerJoin('participant.event', 'event')
            .innerJoin('participant.organization', 'organization')
            .where('event.id = :eventId', { eventId: idEvent })
            .andWhere('organization.id = :organizationId', { organizationId: idOrganization })
            .select('participant.status')
            .getOne();

        if (!participant) {
            throw new NotFoundException(`Participant not found for event ${idEvent} and organization ${idOrganization}`);
        }

        return participant.status;
    }

    async findParticipantsByEvent(id: string): Promise<DomainParticipant[]> {
        const participants = await this.participantRepository
            .createQueryBuilder('participant')
            .innerJoinAndSelect('participant.event', 'event')
            .innerJoinAndSelect('participant.organization', 'organization')
            .where('event.id = :eventId', { eventId: id })
            .getMany();

        return participants.map((participant) => EventParticipantMapper.toDomain(participant));
    }

    async create(participant: DomainParticipant, aEvent: DomainEvent): Promise<DomainParticipant> {
        const typeORMParticipant = EventParticipantMapper.toTypeORM(participant, aEvent);
        const savedParticipant = await this.participantRepository.save(typeORMParticipant);
        return EventParticipantMapper.toDomain(savedParticipant);
    }

    async update(participant: DomainParticipant, aEvent: DomainEvent): Promise<DomainParticipant> {
        const typeORMParticipant = EventParticipantMapper.toTypeORM(participant, aEvent);
        const updateParticipant = await this.participantRepository.save(typeORMParticipant);
        return EventParticipantMapper.toDomain(updateParticipant);
    }

    async delete(id: string): Promise<string> {
        const deleteResult = await this.participantRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }
        return `Participant with ID ${id} deleted successfully`;
    }
} 
import { OrganizationUser as DomainOrganizationOperator } from 'src/domain/organization/model/organization-user.entity';
import { OrganizationMapper } from 'src/infrastructure/organization/typeorm/mapper/organization-typeorm.mapper';
import { OrganizationUser as TypeORMOrganizationOperator } from '../model/organization-user.entity';
import { UserMapper } from '../../../user/typeorm/mapper/user-typeorm.mapper';

export class OrganizationOperatorMapper {
    static toDomain(participant: TypeORMOrganizationOperator): DomainOrganizationOperator {
        return {
            id: participant.id,
            organization: participant.organization ? OrganizationMapper.toDomain(participant.organization) : null,
            user: participant.user ? UserMapper.toDomain(participant.user) : null,
            status: participant.status,
            createdAt: participant.createdAt,
            updatedAt: participant.updatedAt,
            deletedAt: participant.deletedAt || null
        };
    }

    static toTypeORM(
        participant: DomainOrganizationOperator,
    ): TypeORMOrganizationOperator {
        const typeORMParticipant = new TypeORMOrganizationOperator();
        typeORMParticipant.id = participant.id;
        typeORMParticipant.user = UserMapper.toTypeORM(participant.user);
        typeORMParticipant.status = participant.status;
        return typeORMParticipant;
    }
}
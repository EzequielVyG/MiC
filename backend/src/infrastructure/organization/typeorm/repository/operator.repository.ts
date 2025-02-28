import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationUser as TypeORMOperator } from 'src/infrastructure/organization/typeorm/model/organization-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationUser as DomainOperator } from 'src/domain/organization/model/organization-user.entity';
import { OrganizationOperatorMapper } from '../mapper/organization-operator-typeorm.mapper';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { IOperatorRepository } from 'src/domain/organization/port/iOperatorRepository';
import { User } from 'src/domain/user/model/user.entity';

@Injectable()
export class OperatorRepository implements IOperatorRepository {
    constructor(
        @InjectRepository(TypeORMOperator)
        private readonly operatorRepository: Repository<TypeORMOperator>
    ) { }

    async create(aDocument: DomainOperator): Promise<DomainOperator> {
        const typeORMDocument = OrganizationOperatorMapper.toTypeORM(aDocument);
        const savedDocument = await this.operatorRepository.save(typeORMDocument);
        return OrganizationOperatorMapper.toDomain(savedDocument);
    }

    async delete(documentId: string): Promise<string> {
        const deleteResult = await this.operatorRepository.softDelete(documentId);

        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Document with ID ${documentId} not found`);
        }

        return `Document with ID ${documentId} deleted successfully`;
    }

    async findByID(id: string): Promise<DomainOperator> {
        const organization = await this.operatorRepository.findOne({
            where: { id: id },
            relations: [
                'user',
                'organization',
            ],
        });
        return organization ? OrganizationOperatorMapper.toDomain(organization) : null;
    }

    async findByUserAndOrganization(organization: Organization, user: User): Promise<DomainOperator> {

        const document = await this.operatorRepository
            .createQueryBuilder('operator')
            .select(['operator.id', 'operator.status', 'organization', 'user'])
            .innerJoin('operator.organization', 'organization')
            .innerJoin('operator.user', 'user')
            .where('organization.id = :organizationId', { organizationId: organization.id })
            .andWhere('user.id = :userId', { userId: user.id })
            .getOne();

        return document ? OrganizationOperatorMapper.toDomain(document) : null;
    }

    async findByUserEmailAndStatus(user: User, status: string): Promise<DomainOperator[]> {
        try {
            const documents = await this.operatorRepository
                .createQueryBuilder('operator')
                .select(['operator.id', 'operator.status', 'organization', 'user'])
                .innerJoin('operator.organization', 'organization')
                .innerJoin('operator.user', 'user')
                .where('user.id = :userId', { userId: user.id })
                .andWhere('operator.status = :aStatus', { aStatus: status })
                .getMany();

            return documents.map((aDocument) => { return OrganizationOperatorMapper.toDomain(aDocument) });
        } catch (error) {
            console.log("🚀 ~ file: operator.repository.ts:73 ~ OperatorRepository ~ findByUserEmailAndStatus ~ error:", error)

        }

    };

    async update(aOperator: DomainOperator): Promise<DomainOperator> {
        const aOperatorUpdated = await this.operatorRepository.save(OrganizationOperatorMapper.toTypeORM(aOperator));
        return OrganizationOperatorMapper.toDomain(aOperatorUpdated);
    }
}

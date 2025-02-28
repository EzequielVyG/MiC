import { User } from 'src/domain/user/model/user.entity';
import { OrganizationUser } from '../model/organization-user.entity';
import { Organization } from '../model/organization.entity';

export interface IOperatorRepository {
    create(aOperator: OrganizationUser): Promise<OrganizationUser>;
    delete(operatorId: string): Promise<string>;
    findByID(id: string): Promise<OrganizationUser>;
    findByUserAndOrganization(organization: Organization, user: User): Promise<OrganizationUser>;
    findByUserEmailAndStatus(user: User, status: string): Promise<OrganizationUser[]>;
    update(aOperator: OrganizationUser,): Promise<OrganizationUser>
}

export const IOperatorRepository = Symbol('IOperatorRepository');

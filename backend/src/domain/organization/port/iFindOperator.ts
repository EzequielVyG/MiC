import { OrganizationUser } from '../model/organization-user.entity';

export interface IfindOperator {
    findByOrgAndUser(orgId: string, userId): Promise<OrganizationUser>;
    findByUserAndStatus(userId: string, status: string): Promise<OrganizationUser[]>;
}

import { OrganizationUser } from '../model/organization-user.entity';

export interface iUpdateOperator {
    updateStatus(
        id: string,
        status: string
    ): Promise<OrganizationUser>;
}
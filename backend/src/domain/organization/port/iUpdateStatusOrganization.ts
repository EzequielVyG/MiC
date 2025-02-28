import { Organization } from '../model/organization.entity';

export interface iUpdateStatusOrganization {
    update(
        id: string,
        status: string,
        bodyEmail: string
    ): Promise<Organization>;
}
import { Organization } from '../model/organization.entity';

export interface iUpdateDropOrganization {
    update(
        id: string,
    ): Promise<Organization>;
}
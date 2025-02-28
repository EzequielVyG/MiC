import { Organization } from '../model/organization.entity';

export interface IFindByIntegranteEmailOrganization {
    findByIntegranteEmail(email: string): Promise<Organization[]>;
}

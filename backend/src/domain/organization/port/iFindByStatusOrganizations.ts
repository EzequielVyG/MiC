import { Organization } from '../model/organization.entity';

export interface IFindByStatusOrganizations {
    findByStatus(someStatus: string[]): Promise<Organization[]>;
}
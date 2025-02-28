import { Organization } from '../model/organization.entity';

export interface IfindByOwnerOrganization {
    findByOwner(ownerId: string): Promise<Organization[]>;
}

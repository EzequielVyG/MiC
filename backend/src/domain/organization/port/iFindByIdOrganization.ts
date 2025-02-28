import { Organization } from '../model/organization.entity';

export interface IfindByIdOrganization {
	findById(id: string): Promise<Organization>;
}

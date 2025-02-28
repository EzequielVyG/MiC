import { Organization } from '../model/organization.entity';

export interface iDeleteOrganization {
	delete(id: string): Promise<Organization>;
}

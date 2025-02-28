import { Organization } from '../model/organization.entity';

export interface IfindAllOrganization {
	findAll(): Promise<Organization[]>;
}

import { Organization } from '../model/organization.entity';
import { MulterFile } from 'multer';

export interface IOrganizationRepository {
	findAll(): Promise<Organization[]>;
	findByID(id: string): Promise<Organization>;
	create(
		aOrganization: Organization,
		supportingDocumentation: MulterFile
	): Promise<Organization>;
	update(
		aOrganization: Organization,
		supportingDocumentation: MulterFile
	): Promise<Organization>;
	findByOwner(ownerId: string): Promise<Organization[]>;
	findByIntegrante(userId: string): Promise<Organization[]>;
	findByOperator(ownerId: string): Promise<Organization[]>;
	findByStatus(someStatus: string[]): Promise<Organization[]>;
}

export const IOrganizationRepository = Symbol('IOrganizationRepository');

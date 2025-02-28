import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { User } from 'src/domain/user/model/user.entity';
import { OrganizationUser } from '../model/organization-user.entity';
import { Organization } from '../model/organization.entity';

export interface iCreateOrganization {
	create(
		legalName: string,
		address: string,
		cuit: string,
		principalCategory: Category,
		categories: Category[],
		cmi: string,
		phone: string,
		owner: User,
		operators: OrganizationUser[],
		supportingDocumentation: MulterFile[],
		// documentDescription: string[],
		facebook_url:string,
		twitter_url:string,
		instagram_url:string, 
		email:string,
		web_organization_url:string, 
		description:string,
	): Promise<Organization>;
}

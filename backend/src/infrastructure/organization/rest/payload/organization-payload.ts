import { Document } from 'src/domain/organization/model/document.entity';
import { OrganizationUser } from 'src/domain/organization/model/organization-user.entity';
import { CategoryPayload } from 'src/infrastructure/category/rest/payload/category-payload';
import { UserPayload } from 'src/infrastructure/user/rest/payload/user-payload';
export class OrganizationPayload {
	id: string;

	legalName: string;

	address: string;

	cuit: string;

	principalCategory: CategoryPayload;

	categories: CategoryPayload[];

	cmi: string;

	phone: string;

	owner: UserPayload;

	operators: OrganizationUser[];

	supportingDocumentation: Document[];

	facebook_url:string;
	
	twitter_url:string;
	
	instagram_url:string; 
	
	email:string;
	
	web_organization_url:string;

	description:string;

	status: string;

	validator: UserPayload;

	updatedAt: Date;
	createdAt: Date;
}

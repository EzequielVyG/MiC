import { Category } from '../../category/model/category.entity';
import { User } from '../../user/model/user.entity';
import { Document } from './document.entity';
import { OrganizationUser } from './organization-user.entity';

export class Organization {
	id: string;

	legalName: string;

	address: string;

	cuit: string;

	principalCategory: Category;

	categories: Category[];

	cmi: string;

	phone: string;

	owner: User;

	operators: OrganizationUser[];

	supportingDocumentation: Document[];

	status: string;

	validator: User;

	facebook_url: string;

	twitter_url: string;

	instagram_url: string;

	email: string;

	web_organization_url: string; 

	description: string; 

	createdAt: Date;

	updatedAt: Date;

	deletedAt: Date;
}

